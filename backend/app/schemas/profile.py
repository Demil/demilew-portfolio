from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field, computed_field


class SocialLinkBase(BaseModel):
    platform: str = Field(max_length=100)
    url: str = Field(max_length=500)
    display_order: int = Field(default=0, ge=0)
    is_visible: bool = True


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(BaseModel):
    platform: str | None = Field(default=None, max_length=100)
    url: str | None = Field(default=None, max_length=500)
    display_order: int | None = Field(default=None, ge=0)
    is_visible: bool | None = None


class SocialLinkRead(SocialLinkBase):
    id: int
    profile_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileBase(BaseModel):
    full_name: str = Field(max_length=255)
    headline: str = Field(max_length=255)
    biography: str
    location: str = Field(max_length=255)
    email: EmailStr
    cv_media_id: int | None = None
    profile_image_media_id: int | None = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, max_length=255)
    headline: str | None = Field(default=None, max_length=255)
    biography: str | None = None
    location: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = None
    cv_media_id: int | None = None
    profile_image_media_id: int | None = None


class ProfileRead(ProfileBase):
    id: int
    social_links: list[SocialLinkRead] = []
    created_at: datetime
    updated_at: datetime

    @computed_field  # type: ignore[prop-decorator]
    @property
    def profile_image_url(self) -> str | None:
        if self.profile_image_media_id:
            return "/api/v1/profile/photo"
        return None

    model_config = ConfigDict(from_attributes=True)

