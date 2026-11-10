from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import IDSchema, TimestampSchema


class SiteSettingBase(BaseModel):
    key: str = Field(max_length=100)
    value: str
    description: str | None = Field(default=None, max_length=255)


class SiteSettingCreate(SiteSettingBase):
    pass


class SiteSettingUpdate(BaseModel):
    value: str
    description: str | None = Field(default=None, max_length=255)


class SiteSettingRead(IDSchema, TimestampSchema, SiteSettingBase):
    model_config = ConfigDict(from_attributes=True)

