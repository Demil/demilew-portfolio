from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contact import ContactMessage
from app.repositories.base import BaseRepository
from app.schemas.contact import ContactMessageCreate, ContactMessageUpdate


class ContactRepository(BaseRepository[ContactMessage]):
    def __init__(self, db: Session) -> None:
        super().__init__(ContactMessage, db)

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def list_ordered(self, *, skip: int = 0, limit: int = 100) -> list[ContactMessage]:
        """Return messages newest first."""
        stmt = (
            select(ContactMessage)
            .order_by(ContactMessage.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt).all())

    def list_unread(self) -> list[ContactMessage]:
        """Return all unread messages, newest first."""
        stmt = (
            select(ContactMessage)
            .where(ContactMessage.read.is_(False))
            .order_by(ContactMessage.created_at.desc())
        )
        return list(self._db.scalars(stmt).all())

    def unread_count(self) -> int:
        """Return the total number of unread messages."""
        stmt = select(ContactMessage).where(ContactMessage.read.is_(False))
        return len(self._db.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def create(self, schema: ContactMessageCreate) -> ContactMessage:
        return self._create(**schema.model_dump())

    def mark_read(self, message: ContactMessage, schema: ContactMessageUpdate) -> ContactMessage:
        return self._update(message, schema.model_dump())

