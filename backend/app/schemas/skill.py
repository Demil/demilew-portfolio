from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import PublishingStatus
from app.schemas.common import IDSchema


class SkillBase(BaseModel):
    name: str = Field(max_length=100)
    category: str = Field(max_length=100)
    display_order: int = Field(default=0, ge=0)
    icon_name: str | None = Field(default=None, max_length=100)
    status: PublishingStatus = PublishingStatus.PUBLISHED


class SkillCreate(SkillBase):
    """Payload for creating a new skill (admin only)."""
    pass


class SkillUpdate(BaseModel):
    """Payload for partially updating a skill. All fields are optional."""

    name: str | None = Field(default=None, max_length=100)
    category: str | None = Field(default=None, max_length=100)
    display_order: int | None = Field(default=None, ge=0)
    icon_name: str | None = Field(default=None, max_length=100)
    status: PublishingStatus | None = None


class CategoryRename(BaseModel):
    """Payload for renaming an entire skill category card."""
    new_name: str = Field(min_length=1, max_length=100)


class SkillRead(IDSchema, SkillBase):
    """Full skill representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)
