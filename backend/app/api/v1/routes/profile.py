from fastapi import APIRouter, Depends, File, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.media import MediaRead
from app.schemas.profile import (
    ProfileRead,
    ProfileUpdate,
    SocialLinkCreate,
    SocialLinkRead,
    SocialLinkUpdate,
)
from app.services.media import MediaService
from app.services.profile import ProfileService

router = APIRouter(prefix="/profile", tags=["profile"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=ProfileRead, summary="Get public owner profile")
def get_public_profile(db: Session = Depends(get_db)) -> ProfileRead:
    return ProfileService(db).get_public_profile()  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "/admin",
    response_model=ProfileRead,
    summary="Get full profile for administration",
    dependencies=[Depends(require_admin)],
)
def get_admin_profile(db: Session = Depends(get_db)) -> ProfileRead:
    return ProfileService(db).get_admin_profile()  # type: ignore[return-value]


@router.patch(
    "",
    response_model=ProfileRead,
    summary="Update profile information",
    dependencies=[Depends(require_admin)],
)
def update_profile(
    schema: ProfileUpdate,
    db: Session = Depends(get_db),
) -> ProfileRead:
    return ProfileService(db).update_profile(schema)  # type: ignore[return-value]


@router.post(
    "/social-links",
    response_model=SocialLinkRead,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new social link",
    dependencies=[Depends(require_admin)],
)
def add_social_link(
    schema: SocialLinkCreate,
    db: Session = Depends(get_db),
) -> SocialLinkRead:
    return ProfileService(db).add_social_link(schema)  # type: ignore[return-value]


@router.patch(
    "/social-links/{link_id}",
    response_model=SocialLinkRead,
    summary="Update a social link",
    dependencies=[Depends(require_admin)],
)
def update_social_link(
    link_id: int,
    schema: SocialLinkUpdate,
    db: Session = Depends(get_db),
) -> SocialLinkRead:
    return ProfileService(db).update_social_link(link_id, schema)  # type: ignore[return-value]


@router.delete(
    "/social-links/{link_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a social link",
    dependencies=[Depends(require_admin)],
)
def delete_social_link(link_id: int, db: Session = Depends(get_db)) -> None:
    ProfileService(db).delete_social_link(link_id)


# ── CV Upload & Access ────────────────────────────────────────────────────────

@router.get(
    "/cv",
    summary="Get public CV metadata (media id, filename, url) if a CV is uploaded",
)
def get_public_cv(db: Session = Depends(get_db)) -> dict:
    """Return CV media info for public access. Returns 204 if no CV is uploaded."""
    return ProfileService(db).get_cv_info(db)


@router.get(
    "/cv/download",
    summary="Stream or download the owner CV as PDF",
)
def download_cv(download: int = 0, db: Session = Depends(get_db)) -> Response:
    """Public endpoint: streams CV PDF inline with download capability."""
    content, mime_type, filename = ProfileService(db).download_cv(db)
    disposition = "attachment" if download == 1 else "inline"
    return Response(
        content=content,
        media_type=mime_type,
        headers={
            "Content-Disposition": f'{disposition}; filename="{filename}"',
            "Cache-Control": "public, max-age=3600",
        },
    )


@router.post(
    "/cv/upload",
    response_model=MediaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Upload or replace the owner CV (PDF only). Admin-protected.",
    dependencies=[Depends(require_admin)],
)
async def upload_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> MediaRead:
    return await ProfileService(db).upload_cv(file, db)


@router.delete(
    "/cv",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove the uploaded CV and unlink from profile. Admin-protected.",
    dependencies=[Depends(require_admin)],
)
def delete_cv(db: Session = Depends(get_db)) -> None:
    ProfileService(db).delete_cv(db)

