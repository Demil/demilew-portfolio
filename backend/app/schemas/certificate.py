from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import IDSchema, TimestampSchema


class CertificateBase(BaseModel):
    name: str = Field(max_length=255)
    issuer: str = Field(max_length=255)
    issue_date: date
    credential_url: str | None = Field(default=None, max_length=500)
    display_order: int = Field(default=0, ge=0)
    media_id: int | None = None


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    issuer: str | None = Field(default=None, max_length=255)
    issue_date: date | None = None
    credential_url: str | None = Field(default=None, max_length=500)
    display_order: int | None = Field(default=None, ge=0)
    media_id: int | None = None


class CertificateRead(IDSchema, TimestampSchema, CertificateBase):
    model_config = ConfigDict(from_attributes=True)

