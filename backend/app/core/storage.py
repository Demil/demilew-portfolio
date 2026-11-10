"""Storage abstraction layer supporting local filesystem storage with an
extensible interface for future S3/cloud storage providers.
"""

from abc import ABC, abstractmethod
from pathlib import Path
import re
import uuid

from fastapi import HTTPException, status

from app.core.config import settings


class StorageBackend(ABC):
    """Abstract storage backend for media files and documents."""

    @abstractmethod
    def save(self, file_bytes: bytes, original_filename: str, mime_type: str) -> tuple[str, str]:
        """Save raw bytes to storage and return (storage_path, relative_url)."""
        pass

    @abstractmethod
    def read(self, storage_path: str) -> bytes:
        """Read bytes from storage given a storage path."""
        pass

    @abstractmethod
    def delete(self, storage_path: str) -> bool:
        """Delete file from storage."""
        pass

    @abstractmethod
    def exists(self, storage_path: str) -> bool:
        """Check if file exists in storage."""
        pass


class LocalStorageBackend(StorageBackend):
    """Local disk storage implementation with path traversal protection."""

    def __init__(self, upload_dir: str | Path | None = None, base_url: str = "/api/v1/media/files"):
        self.upload_dir = Path(upload_dir or settings.UPLOAD_DIR).resolve()
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.base_url = base_url.rstrip("/")

    def _sanitize_extension(self, filename: str) -> str:
        ext = Path(filename).suffix.lower()
        # Only allow alphanumeric extensions with length between 1 and 6
        if re.match(r"^\.[a-z0-9]{1,6}$", ext):
            return ext
        return ".bin"

    def save(self, file_bytes: bytes, original_filename: str, mime_type: str) -> tuple[str, str]:
        ext = self._sanitize_extension(original_filename)
        unique_name = f"{uuid.uuid4().hex}{ext}"
        target_path = self.upload_dir / unique_name

        with open(target_path, "wb") as f:
            f.write(file_bytes)

        # Store path relative to upload_dir for portability
        storage_path = unique_name
        relative_url = f"{self.base_url}/{unique_name}"
        return storage_path, relative_url

    def read(self, storage_path: str) -> bytes:
        safe_path = (self.upload_dir / Path(storage_path).name).resolve()
        # Guard against directory traversal
        if not safe_path.is_relative_to(self.upload_dir) or not safe_path.is_file():
            raise FileNotFoundError(f"Media file '{storage_path}' not found in storage.")

        with open(safe_path, "rb") as f:
            return f.read()

    def delete(self, storage_path: str) -> bool:
        safe_path = (self.upload_dir / Path(storage_path).name).resolve()
        if safe_path.is_relative_to(self.upload_dir) and safe_path.is_file():
            safe_path.unlink()
            return True
        return False

    def exists(self, storage_path: str) -> bool:
        safe_path = (self.upload_dir / Path(storage_path).name).resolve()
        return safe_path.is_relative_to(self.upload_dir) and safe_path.is_file()


def validate_media_file(
    file_bytes: bytes, filename: str, declared_mime: str
) -> tuple[str, str]:
    """Validate size, extension, declared MIME, and binary magic bytes.
    Returns normalized (mime_type, extension).
    """
    # 1. Size check
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )

    if len(file_bytes) > settings.MAX_FILE_SIZE_BYTES:
        max_mb = settings.MAX_FILE_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum permissible size of {max_mb:.0f} MB.",
        )

    # 2. Extension check
    ext = Path(filename).suffix.lower()
    allowed_exts = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
        ".pdf": "application/pdf",
    }
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' is not permitted. Allowed: {list(allowed_exts.keys())}",
        )

    expected_mime = allowed_exts[ext]
    normalized_mime = declared_mime.lower().split(";")[0].strip()

    # SVG declared can be image/svg+xml or text/xml
    if ext == ".svg" and normalized_mime in ("image/svg+xml", "text/xml", "application/xml"):
        normalized_mime = "image/svg+xml"

    if normalized_mime != expected_mime:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"MIME type mismatch: declared '{declared_mime}' does not match extension '{ext}'.",
        )

    # 3. Magic bytes inspection
    if normalized_mime == "application/pdf":
        if not file_bytes.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid PDF file format (missing PDF magic header).",
            )
    elif normalized_mime == "image/png":
        if not file_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid PNG file format (corrupted magic signature).",
            )
    elif normalized_mime == "image/jpeg":
        if not file_bytes.startswith(b"\xff\xd8\xff"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JPEG file format (corrupted SOI marker).",
            )
    elif normalized_mime == "image/webp":
        if not (file_bytes.startswith(b"RIFF") and file_bytes[8:12] == b"WEBP"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid WebP file format (missing RIFF/WEBP container header).",
            )
    elif normalized_mime == "image/gif":
        if not (file_bytes.startswith(b"GIF87a") or file_bytes.startswith(b"GIF89a")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid GIF file format (missing GIF header signature).",
            )
    elif normalized_mime == "image/svg+xml":
        # Check for SVG tag in text representation and reject dangerous embedded scripts
        try:
            sample = file_bytes[:4096].decode("utf-8", errors="ignore").lower()
            if "<svg" not in sample:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid SVG format: <svg> tag not found.",
                )
            if "<script" in sample:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="SVG rejected: embedded executable script tags are prohibited for security.",
                )
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not parse SVG content.",
            )

    return normalized_mime, ext


_storage_singleton: StorageBackend | None = None


def get_storage() -> StorageBackend:
    """Dependency / accessor for active storage backend."""
    global _storage_singleton
    if _storage_singleton is None:
        _storage_singleton = LocalStorageBackend()
    return _storage_singleton

