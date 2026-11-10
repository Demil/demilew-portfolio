from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.education import Education
from app.models.enums import PublishingStatus
from app.repositories.base import BaseRepository
from app.schemas.education import EducationCreate, EducationUpdate


class EducationRepository(BaseRepository[Education]):
    def __init__(self, db: Session) -> None:
        super().__init__(Education, db)

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def list_ordered(self, published_only: bool = True) -> list[Education]:
        """Return education entries ordered by display_order then start_date desc."""
        stmt = select(Education)
        if published_only:
            stmt = stmt.where(Education.status == PublishingStatus.PUBLISHED)
        stmt = stmt.order_by(Education.display_order, Education.start_date.desc())
        return list(self._db.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def create(self, schema: EducationCreate) -> Education:
        return self._create(**schema.model_dump())

    def update(self, education: Education, schema: EducationUpdate) -> Education:
        return self._update(education, schema.model_dump(exclude_unset=True))
