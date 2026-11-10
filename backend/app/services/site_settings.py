from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.site_settings import SiteSettings
from app.repositories.site_settings import SiteSettingsRepository
from app.schemas.site_settings import SiteSettingCreate, SiteSettingUpdate

# List of setting keys safe to expose publicly
PUBLIC_SETTING_KEYS = {
    "site_title",
    "meta_description",
    "maintenance_mode",
    "contact_email",
    "availability_status",
}


class SiteSettingsService:
    def __init__(self, db: Session) -> None:
        self._repo = SiteSettingsRepository(db)

    def get_public_settings(self) -> dict[str, str]:
        all_settings = self._repo.list_all()
        return {
            s.key: s.value
            for s in all_settings
            if s.key in PUBLIC_SETTING_KEYS
        }

    def list_all(self) -> list[SiteSettings]:
        return self._repo.list_all()

    def get_or_404(self, key: str) -> SiteSettings:
        setting = self._repo.get_by_key(key)
        if not setting:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Setting '{key}' not found",
            )
        return setting

    def set_value(self, key: str, schema: SiteSettingUpdate) -> SiteSettings:
        return self._repo.upsert(key, schema.value, schema.description)

    def delete(self, key: str) -> None:
        setting = self.get_or_404(key)
        self._repo.delete(setting)

