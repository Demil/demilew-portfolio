"""ProjectService — business logic for portfolio projects."""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enums import PublishingStatus
from app.models.project import Project
from app.repositories.project import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, db: Session) -> None:
        self._repo = ProjectRepository(db)

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def get_or_404(self, project_id: int) -> Project:
        project = self._repo.get(project_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return project

    def get_by_slug_or_404(self, slug: str) -> Project:
        project = self._repo.get_by_slug(slug)
        if not project or project.status != PublishingStatus.PUBLISHED:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        return project

    def list_public(self, *, skip: int = 0, limit: int = 100) -> list[Project]:
        return self._repo.list_ordered(skip=skip, limit=limit, published_only=True)

    def list_all_admin(self, *, skip: int = 0, limit: int = 100) -> list[Project]:
        return self._repo.list_ordered(skip=skip, limit=limit, published_only=False)

    def list_featured(self) -> list[Project]:
        return self._repo.list_featured()

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def _assert_slug_free(self, slug: str, exclude_id: int | None = None) -> None:
        existing = self._repo.get_by_slug(slug)
        if existing and existing.id != exclude_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A project with slug '{slug}' already exists",
            )

    def create(self, schema: ProjectCreate) -> Project:
        self._assert_slug_free(schema.slug)
        return self._repo.create(schema)

    def update(self, project_id: int, schema: ProjectUpdate) -> Project:
        project = self.get_or_404(project_id)
        if schema.slug is not None:
            self._assert_slug_free(schema.slug, exclude_id=project.id)
        return self._repo.update(project, schema)

    def delete(self, project_id: int) -> None:
        project = self.get_or_404(project_id)
        self._repo.delete(project)
