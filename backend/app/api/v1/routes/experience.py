from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.experience import ExperienceCreate, ExperienceRead, ExperienceUpdate
from app.services.experience import ExperienceService

router = APIRouter(prefix="/experience", tags=["experience"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[ExperienceRead], summary="List published experience entries")
def list_experience(db: Session = Depends(get_db)) -> list[ExperienceRead]:
    return ExperienceService(db).list_public()  # type: ignore[return-value]


@router.get("/{experience_id}", response_model=ExperienceRead, summary="Get experience by ID")
def get_experience(experience_id: int, db: Session = Depends(get_db)) -> ExperienceRead:
    return ExperienceService(db).get_or_404(experience_id)  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "/admin/all",
    response_model=list[ExperienceRead],
    summary="List all experiences including drafts for administration",
    dependencies=[Depends(require_admin)],
)
def list_all_experience_admin(db: Session = Depends(get_db)) -> list[ExperienceRead]:
    return ExperienceService(db).list_all()  # type: ignore[return-value]


@router.post(
    "",
    response_model=ExperienceRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create an experience entry",
    dependencies=[Depends(require_admin)],
)
def create_experience(
    schema: ExperienceCreate,
    db: Session = Depends(get_db),
) -> ExperienceRead:
    return ExperienceService(db).create(schema)  # type: ignore[return-value]


@router.patch(
    "/{experience_id}",
    response_model=ExperienceRead,
    summary="Update an experience entry",
    dependencies=[Depends(require_admin)],
)
def update_experience(
    experience_id: int,
    schema: ExperienceUpdate,
    db: Session = Depends(get_db),
) -> ExperienceRead:
    return ExperienceService(db).update(experience_id, schema)  # type: ignore[return-value]


@router.delete(
    "/{experience_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an experience entry",
    dependencies=[Depends(require_admin)],
)
def delete_experience(experience_id: int, db: Session = Depends(get_db)) -> None:
    ExperienceService(db).delete(experience_id)
