from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import PublishingStatus
from app.schemas.common import IDSchema, TimestampSchema


class ExperienceBase(BaseModel):
    company: str = Field(max_length=255)
    role: str = Field(max_length=255)
    description: str | None = None
    start_date: date
    end_date: date | None = None
    is_current: bool = False
    display_order: int = Field(default=0, ge=0)
    status: PublishingStatus = PublishingStatus.PUBLISHED

    @field_validator("end_date")
    @classmethod
    def end_date_after_start(cls, v: date | None, info) -> date | None:
        if v is not None and "start_date" in info.data and info.data["start_date"]:
            if v < info.data["start_date"]:
                raise ValueError("end_date must be on or after start_date")
        return v


class ExperienceCreate(ExperienceBase):
    """Payload for creating a new experience entry (admin only)."""
    pass


class ExperienceUpdate(BaseModel):
    """Payload for partially updating an experience entry. All fields are optional."""

    company: str | None = Field(default=None, max_length=255)
    role: str | None = Field(default=None, max_length=255)
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None
    display_order: int | None = Field(default=None, ge=0)
    status: PublishingStatus | None = None


class ExperienceRead(IDSchema, TimestampSchema, ExperienceBase):
    """Full experience representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)
