from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.enums import PublishingStatus
from app.models.project import Project, ProjectTechnology
from app.repositories.base import BaseRepository
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectRepository(BaseRepository[Project]):
    def __init__(self, db: Session) -> None:
        super().__init__(Project, db)

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def get_by_slug(self, slug: str) -> Project | None:
        stmt = select(Project).where(Project.slug == slug)
        return self._db.scalars(stmt).first()

    def list_featured(self) -> list[Project]:
        """Return featured published projects ordered by display_order."""
        stmt = (
            select(Project)
            .where(Project.featured.is_(True), Project.status == PublishingStatus.PUBLISHED)
            .order_by(Project.display_order)
        )
        return list(self._db.scalars(stmt).all())

    def list_ordered(self, *, skip: int = 0, limit: int = 100, published_only: bool = True) -> list[Project]:
        """Return projects ordered by display_order then creation date."""
        stmt = select(Project)
        if published_only:
            stmt = stmt.where(Project.status == PublishingStatus.PUBLISHED)
        stmt = stmt.order_by(Project.display_order, Project.created_at.desc()).offset(skip).limit(limit)
        return list(self._db.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def create(self, schema: ProjectCreate) -> Project:
        data = schema.model_dump()
        tech_list = data.pop("tech_stack", [])
        project = self._create(**data)
        for tech in tech_list:
            self._db.add(ProjectTechnology(project_id=project.id, name=tech))
        self._db.commit()
        self._db.refresh(project)
        return project

    def update(self, project: Project, schema: ProjectUpdate) -> Project:
        data = schema.model_dump(exclude_unset=True)
        if "tech_stack" in data:
            tech_list = data.pop("tech_stack")
            project.technologies.clear()
            for tech in tech_list:
                project.technologies.append(ProjectTechnology(name=tech))
        return self._update(project, data)
