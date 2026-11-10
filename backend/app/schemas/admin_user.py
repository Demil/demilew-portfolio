from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AdminUserBase(BaseModel):
    email: EmailStr


class AdminUserCreate(AdminUserBase):
    """Payload for registering an administrator."""
    password: str = Field(min_length=8, description="Password must be at least 8 characters")


class AdminUserLogin(AdminUserBase):
    """Payload for administrator login."""
    password: str


class AdminUserUpdate(BaseModel):
    """Payload for modifying an administrator."""
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8)
    is_active: bool | None = None


class AdminUserRead(AdminUserBase):
    """Public representation of an administrator."""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminSetupStatus(BaseModel):
    """Reports whether the system has been initialized with an admin."""
    is_initialized: bool


class TokenResponse(BaseModel):
    """Token response payload (tokens also set in HTTP-only cookies)."""
    access_token: str
    token_type: str = "bearer"
    user: AdminUserRead

