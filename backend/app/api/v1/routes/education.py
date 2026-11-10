from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.education import EducationCreate, EducationRead, EducationUpdate
from app.services.education import EducationService

router = APIRouter(prefix="/education", tags=["education"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[EducationRead], summary="List published education entries")
def list_education(db: Session = Depends(get_db)) -> list[EducationRead]:
    return EducationService(db).list_public()  # type: ignore[return-value]


@router.get("/{education_id}", response_model=EducationRead, summary="Get education by ID")
def get_education(education_id: int, db: Session = Depends(get_db)) -> EducationRead:
    return EducationService(db).get_or_404(education_id)  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "/admin/all",
    response_model=list[EducationRead],
    summary="List all education entries including drafts for administration",
    dependencies=[Depends(require_admin)],
)
def list_all_education_admin(db: Session = Depends(get_db)) -> list[EducationRead]:
    return EducationService(db).list_all()  # type: ignore[return-value]


@router.post(
    "",
    response_model=EducationRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create an education entry",
    dependencies=[Depends(require_admin)],
)
def create_education(
    schema: EducationCreate,
    db: Session = Depends(get_db),
) -> EducationRead:
    return EducationService(db).create(schema)  # type: ignore[return-value]


@router.patch(
    "/{education_id}",
    response_model=EducationRead,
    summary="Update an education entry",
    dependencies=[Depends(require_admin)],
)
def update_education(
    education_id: int,
    schema: EducationUpdate,
    db: Session = Depends(get_db),
) -> EducationRead:
    return EducationService(db).update(education_id, schema)  # type: ignore[return-value]


@router.delete(
    "/{education_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an education entry",
    dependencies=[Depends(require_admin)],
)
def delete_education(education_id: int, db: Session = Depends(get_db)) -> None:
    EducationService(db).delete(education_id)
