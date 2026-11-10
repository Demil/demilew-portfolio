from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.site_settings import SiteSettingRead, SiteSettingUpdate
from app.services.site_settings import SiteSettingsService

router = APIRouter(prefix="/settings", tags=["settings"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("/public", response_model=dict[str, str], summary="Get public website settings")
def get_public_settings(db: Session = Depends(get_db)) -> dict[str, str]:
    return SiteSettingsService(db).get_public_settings()


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "",
    response_model=list[SiteSettingRead],
    summary="List all site settings",
    dependencies=[Depends(require_admin)],
)
def list_settings(db: Session = Depends(get_db)) -> list[SiteSettingRead]:
    return SiteSettingsService(db).list_all()  # type: ignore[return-value]


@router.get(
    "/{key}",
    response_model=SiteSettingRead,
    summary="Get a setting by key",
    dependencies=[Depends(require_admin)],
)
def get_setting(key: str, db: Session = Depends(get_db)) -> SiteSettingRead:
    return SiteSettingsService(db).get_or_404(key)  # type: ignore[return-value]


@router.put(
    "/{key}",
    response_model=SiteSettingRead,
    summary="Create or update a site setting",
    dependencies=[Depends(require_admin)],
)
def upsert_setting(
    key: str,
    schema: SiteSettingUpdate,
    db: Session = Depends(get_db),
) -> SiteSettingRead:
    return SiteSettingsService(db).set_value(key, schema)  # type: ignore[return-value]


@router.delete(
    "/{key}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a site setting",
    dependencies=[Depends(require_admin)],
)
def delete_setting(key: str, db: Session = Depends(get_db)) -> None:
    SiteSettingsService(db).delete(key)

