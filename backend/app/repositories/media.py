from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.media import Media
from app.repositories.base import BaseRepository


class MediaRepository(BaseRepository[Media]):
    def __init__(self, db: Session) -> None:
        super().__init__(Media, db)

    def create_media(
        self,
        filename: str,
        file_path: str,
        mime_type: str,
        file_size_bytes: int,
        alt_text: str | None = None,
    ) -> Media:
        return self._create(
            filename=filename,
            file_path=file_path,
            mime_type=mime_type,
            file_size_bytes=file_size_bytes,
            alt_text=alt_text,
        )

    def update_alt_text(self, media: Media, alt_text: str | None) -> Media:
        return self._update(media, {"alt_text": alt_text})

    def count_total(self) -> int:
        stmt = select(func.count()).select_from(Media)
        return self._db.scalar(stmt) or 0

    def list_recent(self, skip: int = 0, limit: int = 50) -> list[Media]:
        stmt = select(Media).order_by(Media.created_at.desc()).offset(skip).limit(limit)
        return list(self._db.scalars(stmt).all())

