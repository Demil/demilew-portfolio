from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.storage import validate_media_file, get_storage
from app.models.profile import Profile
from app.models.social_link import SocialLink
from app.repositories.media import MediaRepository
from app.repositories.profile import ProfileRepository
from app.schemas.media import MediaRead
from app.schemas.profile import ProfileUpdate, SocialLinkCreate, SocialLinkUpdate


class ProfileService:
    def __init__(self, db: Session) -> None:
        self._repo = ProfileRepository(db)

    def get_public_profile(self) -> Profile:
        """Return owner profile with visible social links ordered by display_order."""
        profile = self._repo.get_or_create_default()
        # Sort social links by display_order and filter only visible ones for public
        profile.social_links = [
            link for link in profile.social_links if link.is_visible
        ]
        profile.social_links.sort(key=lambda x: x.display_order)
        return profile

    def get_admin_profile(self) -> Profile:
        """Return full profile including all social links for CMS administration."""
        profile = self._repo.get_or_create_default()
        profile.social_links.sort(key=lambda x: x.display_order)
        return profile

    def update_profile(self, schema: ProfileUpdate) -> Profile:
        profile = self._repo.get_or_create_default()
        return self._repo.update_profile(profile, schema)

    # ── Social Links ──────────────────────────────────────────────────────────

    def add_social_link(self, schema: SocialLinkCreate) -> SocialLink:
        profile = self._repo.get_or_create_default()
        return self._repo.create_social_link(profile.id, schema)

    def update_social_link(self, link_id: int, schema: SocialLinkUpdate) -> SocialLink:
        link = self._repo.get_social_link(link_id)
        if not link:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Social link not found",
            )
        return self._repo.update_social_link(link, schema)

    def delete_social_link(self, link_id: int) -> None:
        link = self._repo.get_social_link(link_id)
        if not link:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Social link not found",
            )
        self._repo.delete_social_link(link)

    # ── CV Management ─────────────────────────────────────────────────────────

    def get_cv_info(self, db: Session) -> dict:
        """Return CV media metadata for public CV access. Returns empty dict if none."""
        profile = self._repo.get_or_create_default()
        if not profile.cv_media_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No CV has been uploaded yet.",
            )
        media_repo = MediaRepository(db)
        media = media_repo.get(profile.cv_media_id)
        if not media:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CV file record not found.",
            )
        return {
            "id": media.id,
            "filename": media.filename,
            "file_size_bytes": media.file_size_bytes,
            "mime_type": media.mime_type,
            "url": f"/api/v1/profile/cv/download",
            "uploaded_at": media.created_at.isoformat(),
        }

    def download_cv(self, db: Session) -> tuple[bytes, str, str]:
        """Stream CV content; raises 404 if no CV is configured."""
        profile = self._repo.get_or_create_default()
        if not profile.cv_media_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No CV has been uploaded yet.",
            )
        media_repo = MediaRepository(db)
        media = media_repo.get(profile.cv_media_id)
        if not media:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CV media record not found.",
            )
        storage = get_storage()
        try:
            content = storage.read(media.file_path)
        except FileNotFoundError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CV file missing from storage.",
            )
        return content, media.mime_type, media.filename

    async def upload_cv(self, file: UploadFile, db: Session) -> MediaRead:
        """Upload a new CV PDF, delete the old one (if any), and link it to the profile."""
        filename = file.filename or "cv.pdf"
        content_type = file.content_type or "application/pdf"

        # Validate it's a PDF
        file_bytes = await file.read()
        normalized_mime, _ = validate_media_file(file_bytes, filename, content_type)
        if normalized_mime != "application/pdf":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are accepted for CV upload.",
            )

        profile = self._repo.get_or_create_default()
        media_repo = MediaRepository(db)
        storage = get_storage()

        # Delete old CV file and media record if one exists
        if profile.cv_media_id:
            old_media = media_repo.get(profile.cv_media_id)
            if old_media:
                try:
                    storage.delete(old_media.file_path)
                except Exception:
                    pass
                media_repo.delete(old_media)

        # Save new file
        storage_path, _ = storage.save(file_bytes, filename, normalized_mime)
        new_media = media_repo.create_media(
            filename=filename,
            file_path=storage_path,
            mime_type=normalized_mime,
            file_size_bytes=len(file_bytes),
            alt_text=f"Curriculum Vitae — Demilew Terefe",
        )

        # Link to profile
        profile.cv_media_id = new_media.id
        db.commit()
        db.refresh(new_media)

        return MediaRead.model_validate(new_media)

    def delete_cv(self, db: Session) -> None:
        """Remove CV file from storage and unlink from profile."""
        profile = self._repo.get_or_create_default()
        if not profile.cv_media_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No CV is currently linked to this profile.",
            )
        media_repo = MediaRepository(db)
        storage = get_storage()
        old_media = media_repo.get(profile.cv_media_id)
        if old_media:
            try:
                storage.delete(old_media.file_path)
            except Exception:
                pass
            media_repo.delete(old_media)
        profile.cv_media_id = None
        db.commit()

    # ── Profile Photo Management ──────────────────────────────────────────────

    def get_profile_image_info(self, db: Session) -> dict:
        """Return profile photo media metadata. Raises 404 if none."""
        profile = self._repo.get_or_create_default()
        if not profile.profile_image_media_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No profile image has been uploaded yet.",
            )
        media_repo = MediaRepository(db)
        media = media_repo.get(profile.profile_image_media_id)
        if not media:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile image record not found.",
            )
        return {
            "id": media.id,
            "filename": media.filename,
            "file_size_bytes": media.file_size_bytes,
            "mime_type": media.mime_type,
            "url": "/api/v1/profile/photo",
            "uploaded_at": media.created_at.isoformat(),
        }

    def download_profile_image(self, db: Session) -> tuple[bytes, str, str]:
        """Stream profile photo content; raises 404 if no photo is configured."""
        profile = self._repo.get_or_create_default()
        if not profile.profile_image_media_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No profile image has been uploaded yet.",
            )
        media_repo = MediaRepository(db)
        media = media_repo.get(profile.profile_image_media_id)
        if not media:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile image media record not found.",
            )
        storage = get_storage()
        try:
            content = storage.read(media.file_path)
        except FileNotFoundError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile image file missing from storage.",
            )
        return content, media.mime_type, media.filename

    async def upload_profile_image(self, file: UploadFile, db: Session) -> MediaRead:
        """Upload a new profile photo (JPEG, PNG, WebP, GIF, SVG), delete old one, and link to profile."""
        filename = file.filename or "profile.jpg"
        content_type = file.content_type or "image/jpeg"

        file_bytes = await file.read()
        normalized_mime, _ = validate_media_file(file_bytes, filename, content_type)
        if not normalized_mime.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only image files (JPEG, PNG, WebP, GIF, SVG) are accepted for profile photo upload.",
            )

        profile = self._repo.get_or_create_default()
        media_repo = MediaRepository(db)
        storage = get_storage()

        # Delete old profile image file and media record if one exists
        if profile.profile_image_media_id:
            old_media = media_repo.get(profile.profile_image_media_id)
            if old_media:
                try:
                    storage.delete(old_media.file_path)
                except Exception:
                    pass
                media_repo.delete(old_media)

        # Save new file
        storage_path, _ = storage.save(file_bytes, filename, normalized_mime)
        new_media = media_repo.create_media(
            filename=filename,
            file_path=storage_path,
            mime_type=normalized_mime,
            file_size_bytes=len(file_bytes),
            alt_text=f"Profile Photo — {profile.full_name}",
        )

        # Link to profile
        profile.profile_image_media_id = new_media.id
        db.commit()
        db.refresh(new_media)

        return MediaRead.model_validate(new_media)

    def delete_profile_image(self, db: Session) -> None:
        """Remove profile image from storage and unlink from profile."""
        profile = self._repo.get_or_create_default()
        if not profile.profile_image_media_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No profile image is currently linked to this profile.",
            )
        media_repo = MediaRepository(db)
        storage = get_storage()
        old_media = media_repo.get(profile.profile_image_media_id)
        if old_media:
            try:
                storage.delete(old_media.file_path)
            except Exception:
                pass
            media_repo.delete(old_media)
        profile.profile_image_media_id = None
        db.commit()

