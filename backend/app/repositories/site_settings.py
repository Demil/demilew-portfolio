from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site_settings import SiteSettings
from app.repositories.base import BaseRepository


class SiteSettingsRepository(BaseRepository[SiteSettings]):
    def __init__(self, db: Session) -> None:
        super().__init__(SiteSettings, db)

    def get_by_key(self, key: str) -> SiteSettings | None:
        stmt = select(SiteSettings).where(SiteSettings.key == key)
        return self._db.scalars(stmt).first()

    def list_all(self) -> list[SiteSettings]:
        stmt = select(SiteSettings).order_by(SiteSettings.key)
        return list(self._db.scalars(stmt).all())

    def upsert(self, key: str, value: str, description: str | None = None) -> SiteSettings:
        setting = self.get_by_key(key)
        if setting:
            setting.value = value
            if description is not None:
                setting.description = description
            self._db.commit()
            self._db.refresh(setting)
            return setting
        else:
            return self._create(key=key, value=value, description=description)

