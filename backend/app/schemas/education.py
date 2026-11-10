from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import PublishingStatus
from app.schemas.common import IDSchema, TimestampSchema


class EducationBase(BaseModel):
    institution: str = Field(max_length=255)
    degree: str = Field(max_length=255)
    field: str = Field(max_length=255)
    start_date: date
    end_date: date | None = None
    cgpa: str | None = Field(default=None, max_length=50)
    display_order: int = Field(default=0, ge=0)
    status: PublishingStatus = PublishingStatus.PUBLISHED

    @field_validator("end_date")
    @classmethod
    def end_date_after_start(cls, v: date | None, info) -> date | None:
        if v is not None and "start_date" in info.data and info.data["start_date"]:
            if v < info.data["start_date"]:
                raise ValueError("end_date must be on or after start_date")
        return v


class EducationCreate(EducationBase):
    """Payload for creating a new education entry (admin only)."""
    pass


class EducationUpdate(BaseModel):
    """Payload for partially updating an education entry. All fields are optional."""

    institution: str | None = Field(default=None, max_length=255)
    degree: str | None = Field(default=None, max_length=255)
    field: str | None = Field(default=None, max_length=255)
    start_date: date | None = None
    end_date: date | None = None
    cgpa: str | None = Field(default=None, max_length=50)
    display_order: int | None = Field(default=None, ge=0)
    status: PublishingStatus | None = None


class EducationRead(IDSchema, TimestampSchema, EducationBase):
    """Full education representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)
