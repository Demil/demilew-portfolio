from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.enums import PublishingStatus
from app.models.experience import Experience
from app.repositories.base import BaseRepository
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


class ExperienceRepository(BaseRepository[Experience]):
    def __init__(self, db: Session) -> None:
        super().__init__(Experience, db)

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def list_ordered(self, published_only: bool = True) -> list[Experience]:
        """Return experiences ordered by display_order, current status, then start_date desc."""
        stmt = select(Experience)
        if published_only:
            stmt = stmt.where(Experience.status == PublishingStatus.PUBLISHED)
        stmt = stmt.order_by(
            Experience.display_order,
            Experience.is_current.desc(),
            Experience.start_date.desc(),
        )
        return list(self._db.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def create(self, schema: ExperienceCreate) -> Experience:
        return self._create(**schema.model_dump())

    def update(self, experience: Experience, schema: ExperienceUpdate) -> Experience:
        return self._update(experience, schema.model_dump(exclude_unset=True))
