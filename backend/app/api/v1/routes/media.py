from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    Response,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.media import MediaList, MediaRead, MediaUpdate
from app.services.media import MediaService

router = APIRouter(prefix="/media", tags=["media"])


# ── Public Endpoints ──────────────────────────────────────────────────────────

@router.get(
    "/files/{filename}",
    summary="Access or stream a stored media file by storage filename",
)
def get_media_file(
    filename: str,
    db: Session = Depends(get_db),
) -> Response:
    content, mime_type = MediaService(db).get_file_by_filename(filename)
    return Response(
        content=content,
        media_type=mime_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )


@router.get(
    "/{media_id}/download",
    summary="Download or view media content by record ID",
)
def download_media_file(
    media_id: int,
    db: Session = Depends(get_db),
) -> Response:
    content, mime_type, filename = MediaService(db).get_file_content(media_id)
    return Response(
        content=content,
        media_type=mime_type,
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )


@router.get(
    "/{media_id}",
    response_model=MediaRead,
    summary="Get media metadata by ID",
)
def get_media_metadata(
    media_id: int,
    db: Session = Depends(get_db),
) -> MediaRead:
    media = MediaService(db).get_or_404(media_id)
    return MediaRead.model_validate(media)


# ── Administrative Protected Endpoints (🔒) ──────────────────────────────────

@router.get(
    "",
    response_model=MediaList,
    summary="List media library assets (Paginated)",
    dependencies=[Depends(require_admin)],
)
def list_media(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> MediaList:
    return MediaService(db).list_media(skip=skip, limit=limit)


@router.post(
    "/upload",
    response_model=MediaRead,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a media file (Image or PDF document)",
    dependencies=[Depends(require_admin)],
)
async def upload_media(
    file: UploadFile = File(...),
    alt_text: str | None = Form(None),
    db: Session = Depends(get_db),
) -> MediaRead:
    return await MediaService(db).upload_file(file=file, alt_text=alt_text)


@router.patch(
    "/{media_id}",
    response_model=MediaRead,
    summary="Update media alt text or metadata",
    dependencies=[Depends(require_admin)],
)
def update_media(
    media_id: int,
    schema: MediaUpdate,
    db: Session = Depends(get_db),
) -> MediaRead:
    return MediaService(db).update_alt_text(media_id, schema)


@router.delete(
    "/{media_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a media item from database and storage",
    dependencies=[Depends(require_admin)],
)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
) -> None:
    MediaService(db).delete_media(media_id)

