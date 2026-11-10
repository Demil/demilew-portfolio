import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import PublishingStatus
from app.schemas.common import IDSchema, TimestampSchema


class ProjectBase(BaseModel):
    title: str = Field(max_length=255)
    slug: str = Field(max_length=255, description="URL-safe identifier, e.g. 'my-project'")
    description: str
    problem_statement: str | None = None
    technical_approach: str | None = None
    tech_stack: list[str] = Field(default_factory=list)
    github_url: str | None = Field(default=None, max_length=500)
    live_url: str | None = Field(default=None, max_length=500)
    image_media_id: int | None = None
    featured: bool = False
    display_order: int = Field(default=0, ge=0)
    status: PublishingStatus = PublishingStatus.PUBLISHED

    @field_validator("slug")
    @classmethod
    def slug_must_be_url_safe(cls, v: str) -> str:
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
            raise ValueError(
                "slug must be lowercase alphanumeric words separated by hyphens"
            )
        return v


class ProjectCreate(ProjectBase):
    """Payload for creating a new project (admin only)."""
    pass


class ProjectUpdate(BaseModel):
    """Payload for partially updating a project. All fields are optional."""

    title: str | None = Field(default=None, max_length=255)
    slug: str | None = Field(default=None, max_length=255)
    description: str | None = None
    problem_statement: str | None = None
    technical_approach: str | None = None
    tech_stack: list[str] | None = None
    github_url: str | None = Field(default=None, max_length=500)
    live_url: str | None = Field(default=None, max_length=500)
    image_media_id: int | None = None
    featured: bool | None = None
    display_order: int | None = Field(default=None, ge=0)
    status: PublishingStatus | None = None

    @field_validator("slug")
    @classmethod
    def slug_must_be_url_safe(cls, v: str | None) -> str | None:
        if v is not None and not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
            raise ValueError(
                "slug must be lowercase alphanumeric words separated by hyphens"
            )
        return v


class ProjectRead(IDSchema, TimestampSchema, ProjectBase):
    """Full project representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)
