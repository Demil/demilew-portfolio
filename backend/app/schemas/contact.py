from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.common import IDSchema, TimestampSchema


class ContactMessageBase(BaseModel):
    name: str = Field(max_length=255)
    email: EmailStr
    subject: str = Field(max_length=500)
    message: str = Field(min_length=10, description="Message body (min 10 characters)")


class ContactMessageCreate(ContactMessageBase):
    """Payload for submitting a contact form message (public endpoint)."""
    pass


class ContactMessageUpdate(BaseModel):
    """Payload for updating a contact message — admin can only flip the read flag."""

    read: bool


class ContactMessageRead(IDSchema, TimestampSchema, ContactMessageBase):
    """Full contact message representation returned by the API (admin only)."""

    read: bool

    model_config = ConfigDict(from_attributes=True)

