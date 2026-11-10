"""ContactService — business logic for the contact form."""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.contact import ContactMessage
from app.repositories.contact import ContactRepository
from app.schemas.contact import ContactMessageCreate, ContactMessageUpdate


class ContactService:
    def __init__(self, db: Session) -> None:
        self._repo = ContactRepository(db)

    def get_or_404(self, message_id: int) -> ContactMessage:
        msg = self._repo.get(message_id)
        if not msg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
            )
        return msg

    def list_all(self, *, skip: int = 0, limit: int = 100) -> list[ContactMessage]:
        return self._repo.list_ordered(skip=skip, limit=limit)

    def list_unread(self) -> list[ContactMessage]:
        return self._repo.list_unread()

    def unread_count(self) -> int:
        return self._repo.unread_count()

    def submit(self, schema: ContactMessageCreate) -> ContactMessage:
        """Accept a public contact form submission."""
        return self._repo.create(schema)

    def mark_read(self, message_id: int, schema: ContactMessageUpdate) -> ContactMessage:
        """Allow an admin to flip the read flag on a message."""
        msg = self.get_or_404(message_id)
        return self._repo.mark_read(msg, schema)

    def delete(self, message_id: int) -> None:
        msg = self.get_or_404(message_id)
        self._repo.delete(msg)

