from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.services.project import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[ProjectRead], summary="List published projects")
def list_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[ProjectRead]:
    return ProjectService(db).list_public(skip=skip, limit=limit)  # type: ignore[return-value]


@router.get("/featured", response_model=list[ProjectRead], summary="List featured published projects")
def list_featured_projects(db: Session = Depends(get_db)) -> list[ProjectRead]:
    return ProjectService(db).list_featured()  # type: ignore[return-value]


@router.get("/{slug}", response_model=ProjectRead, summary="Get project by slug")
def get_project(slug: str, db: Session = Depends(get_db)) -> ProjectRead:
    return ProjectService(db).get_by_slug_or_404(slug)  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "/admin/all",
    response_model=list[ProjectRead],
    summary="List all projects including drafts for administration",
    dependencies=[Depends(require_admin)],
)
def list_all_projects_admin(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[ProjectRead]:
    return ProjectService(db).list_all_admin(skip=skip, limit=limit)  # type: ignore[return-value]


@router.post(
    "",
    response_model=ProjectRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a project",
    dependencies=[Depends(require_admin)],
)
def create_project(schema: ProjectCreate, db: Session = Depends(get_db)) -> ProjectRead:
    return ProjectService(db).create(schema)  # type: ignore[return-value]


@router.patch(
    "/{project_id}",
    response_model=ProjectRead,
    summary="Update a project",
    dependencies=[Depends(require_admin)],
)
def update_project(
    project_id: int,
    schema: ProjectUpdate,
    db: Session = Depends(get_db),
) -> ProjectRead:
    return ProjectService(db).update(project_id, schema)  # type: ignore[return-value]


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a project",
    dependencies=[Depends(require_admin)],
)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> None:
    ProjectService(db).delete(project_id)
