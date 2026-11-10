import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.common import IDSchema, TimestampSchema


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    """Payload for creating a new admin user."""

    password: str = Field(min_length=8, description="Plain-text password (min 8 chars)")


class UserUpdate(BaseModel):
    """Payload for updating an existing user. All fields are optional."""

    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8)


class UserRead(IDSchema, TimestampSchema, UserBase):
    """Full user representation returned by the API (password never exposed)."""

    is_admin: bool

    model_config = ConfigDict(from_attributes=True)

