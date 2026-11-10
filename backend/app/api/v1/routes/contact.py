from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.contact import ContactMessageCreate, ContactMessageRead, ContactMessageUpdate
from app.services.contact import ContactService

router = APIRouter(prefix="/contact", tags=["contact"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=ContactMessageRead,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a contact form message",
)
def submit_contact(schema: ContactMessageCreate, db: Session = Depends(get_db)) -> ContactMessageRead:
    return ContactService(db).submit(schema)  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "",
    response_model=list[ContactMessageRead],
    summary="List all messages (admin)",
    dependencies=[Depends(require_admin)],
)
def list_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[ContactMessageRead]:
    return ContactService(db).list_all(skip=skip, limit=limit)  # type: ignore[return-value]


@router.get(
    "/unread",
    response_model=list[ContactMessageRead],
    summary="List unread messages (admin)",
    dependencies=[Depends(require_admin)],
)
def list_unread_messages(db: Session = Depends(get_db)) -> list[ContactMessageRead]:
    return ContactService(db).list_unread()  # type: ignore[return-value]


@router.get(
    "/unread/count",
    response_model=dict,
    summary="Count of unread messages (admin)",
    dependencies=[Depends(require_admin)],
)
def unread_count(db: Session = Depends(get_db)) -> dict:
    return {"unread": ContactService(db).unread_count()}


@router.patch(
    "/{message_id}",
    response_model=ContactMessageRead,
    summary="Mark a message as read/unread (admin)",
    dependencies=[Depends(require_admin)],
)
def update_message(
    message_id: int,
    schema: ContactMessageUpdate,
    db: Session = Depends(get_db),
) -> ContactMessageRead:
    return ContactService(db).mark_read(message_id, schema)  # type: ignore[return-value]


@router.delete(
    "/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a message (admin)",
    dependencies=[Depends(require_admin)],
)
def delete_message(message_id: int, db: Session = Depends(get_db)) -> None:
    ContactService(db).delete(message_id)
