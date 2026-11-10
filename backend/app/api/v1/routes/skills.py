from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.skill import CategoryRename, SkillCreate, SkillRead, SkillUpdate
from app.services.skill import SkillService

router = APIRouter(prefix="/skills", tags=["skills"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[SkillRead], summary="List published skills")
def list_skills(db: Session = Depends(get_db)) -> list[SkillRead]:
    return SkillService(db).list_public()  # type: ignore[return-value]


@router.get(
    "/category/{category}",
    response_model=list[SkillRead],
    summary="List published skills by category",
)
def list_skills_by_category(
    category: str,
    db: Session = Depends(get_db),
) -> list[SkillRead]:
    return SkillService(db).list_by_category(category)  # type: ignore[return-value]


@router.get("/{skill_id}", response_model=SkillRead, summary="Get skill by ID")
def get_skill(skill_id: int, db: Session = Depends(get_db)) -> SkillRead:
    return SkillService(db).get_or_404(skill_id)  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "/admin/all",
    response_model=list[SkillRead],
    summary="List all skills including drafts for administration",
    dependencies=[Depends(require_admin)],
)
def list_all_skills_admin(db: Session = Depends(get_db)) -> list[SkillRead]:
    return SkillService(db).list_all_admin()  # type: ignore[return-value]


@router.post(
    "",
    response_model=SkillRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a skill",
    dependencies=[Depends(require_admin)],
)
def create_skill(schema: SkillCreate, db: Session = Depends(get_db)) -> SkillRead:
    return SkillService(db).create(schema)  # type: ignore[return-value]


@router.patch(
    "/{skill_id}",
    response_model=SkillRead,
    summary="Update a skill",
    dependencies=[Depends(require_admin)],
)
def update_skill(
    skill_id: int,
    schema: SkillUpdate,
    db: Session = Depends(get_db),
) -> SkillRead:
    return SkillService(db).update(skill_id, schema)  # type: ignore[return-value]


@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a skill",
    dependencies=[Depends(require_admin)],
)
def delete_skill(skill_id: int, db: Session = Depends(get_db)) -> None:
    SkillService(db).delete(skill_id)


@router.delete(
    "/category/{category}",
    status_code=status.HTTP_200_OK,
    summary="Delete all skills in a category card",
    dependencies=[Depends(require_admin)],
)
def delete_skill_category(category: str, db: Session = Depends(get_db)) -> dict[str, int]:
    count = SkillService(db).delete_category(category)
    return {"deleted": count}


@router.patch(
    "/category/{category}/rename",
    status_code=status.HTTP_200_OK,
    summary="Rename an entire skill category card",
    dependencies=[Depends(require_admin)],
)
def rename_skill_category(
    category: str,
    payload: CategoryRename,
    db: Session = Depends(get_db),
) -> dict[str, int]:
    count = SkillService(db).rename_category(category, payload.new_name)
    return {"renamed": count}
