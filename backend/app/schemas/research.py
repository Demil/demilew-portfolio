import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import PublishingStatus
from app.schemas.common import IDSchema, TimestampSchema


class ResearchBase(BaseModel):
    title: str = Field(max_length=255)
    slug: str = Field(max_length=255, description="URL-safe identifier")
    description: str
    methodology: str | None = None
    publication_url: str | None = Field(default=None, max_length=500)
    display_order: int = Field(default=0, ge=0)
    status: PublishingStatus = PublishingStatus.DRAFT

    @field_validator("slug")
    @classmethod
    def slug_must_be_url_safe(cls, v: str) -> str:
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
            raise ValueError("slug must be lowercase alphanumeric words separated by hyphens")
        return v


class ResearchCreate(ResearchBase):
    pass


class ResearchUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    description: str | None = None
    methodology: str | None = None
    publication_url: str | None = Field(default=None, max_length=500)
    display_order: int | None = Field(default=None, ge=0)
    status: PublishingStatus | None = None

    @field_validator("slug")
    @classmethod
    def slug_must_be_url_safe(cls, v: str | None) -> str | None:
        if v is not None and not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
            raise ValueError("slug must be lowercase alphanumeric words separated by hyphens")
        return v


class ResearchRead(IDSchema, TimestampSchema, ResearchBase):
    model_config = ConfigDict(from_attributes=True)

