from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.storage import StorageBackend, get_storage, validate_media_file
from app.models.media import Media
from app.repositories.media import MediaRepository
from app.schemas.media import MediaList, MediaRead, MediaUpdate


class MediaService:
    def __init__(self, db: Session, storage: StorageBackend | None = None) -> None:
        self._repo = MediaRepository(db)
        self._storage = storage or get_storage()

    def get_or_404(self, media_id: int) -> Media:
        media = self._repo.get(media_id)
        if not media:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Media file with id {media_id} not found.",
            )
        return media

    def list_media(self, skip: int = 0, limit: int = 50) -> MediaList:
        total = self._repo.count_total()
        items = self._repo.list_recent(skip=skip, limit=limit)
        return MediaList(total=total, items=[MediaRead.model_validate(m) for m in items])

    async def upload_file(
        self, file: UploadFile, alt_text: str | None = None
    ) -> MediaRead:
        filename = file.filename or "uploaded_file"
        content_type = file.content_type or "application/octet-stream"

        file_bytes = await file.read()
        normalized_mime, _ = validate_media_file(file_bytes, filename, content_type)

        storage_path, _ = self._storage.save(file_bytes, filename, normalized_mime)

        media = self._repo.create_media(
            filename=filename,
            file_path=storage_path,
            mime_type=normalized_mime,
            file_size_bytes=len(file_bytes),
            alt_text=alt_text,
        )
        return MediaRead.model_validate(media)

    def update_alt_text(self, media_id: int, schema: MediaUpdate) -> MediaRead:
        media = self.get_or_404(media_id)
        updated = self._repo.update_alt_text(media, schema.alt_text)
        return MediaRead.model_validate(updated)

    def delete_media(self, media_id: int) -> None:
        media = self.get_or_404(media_id)
        # Attempt storage deletion first
        try:
            self._storage.delete(media.file_path)
        except Exception:
            pass  # Continue to delete DB record even if storage deletion encounters warning
        self._repo.delete(media)

    def get_file_content(self, media_id: int) -> tuple[bytes, str, str]:
        media = self.get_or_404(media_id)
        try:
            content = self._storage.read(media.file_path)
        except FileNotFoundError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File content not found in storage.",
            )
        return content, media.mime_type, media.filename

    def get_file_by_filename(self, filename: str) -> tuple[bytes, str]:
        try:
            content = self._storage.read(filename)
        except FileNotFoundError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found in storage.",
            )
        # Infer MIME type from extension
        ext = filename.lower().split(".")[-1] if "." in filename else ""
        mime_map = {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "webp": "image/webp",
            "svg": "image/svg+xml",
            "gif": "image/gif",
            "pdf": "application/pdf",
        }
        mime_type = mime_map.get(ext, "application/octet-stream")
        return content, mime_type

