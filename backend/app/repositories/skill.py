from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.enums import PublishingStatus
from app.models.skill import Skill
from app.repositories.base import BaseRepository
from app.schemas.skill import SkillCreate, SkillUpdate


class SkillRepository(BaseRepository[Skill]):
    def __init__(self, db: Session) -> None:
        super().__init__(Skill, db)

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def list_by_category(self, category: str, published_only: bool = True) -> list[Skill]:
        """Return all skills in a given category ordered by display_order then name."""
        stmt = select(Skill).where(Skill.category == category)
        if published_only:
            stmt = stmt.where(Skill.status == PublishingStatus.PUBLISHED)
        stmt = stmt.order_by(Skill.display_order, Skill.name)
        return list(self._db.scalars(stmt).all())

    def list_ordered(self, published_only: bool = True) -> list[Skill]:
        """Return all skills grouped by category and ordered by display_order then name."""
        stmt = select(Skill)
        if published_only:
            stmt = stmt.where(Skill.status == PublishingStatus.PUBLISHED)
        stmt = stmt.order_by(Skill.category, Skill.display_order, Skill.name)
        return list(self._db.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def create(self, schema: SkillCreate) -> Skill:
        return self._create(**schema.model_dump())

    def update(self, skill: Skill, schema: SkillUpdate) -> Skill:
        return self._update(skill, schema.model_dump(exclude_unset=True))

    def delete_by_category(self, category: str) -> int:
        """Delete all skills belonging to category. Returns count of deleted skills."""
        stmt = select(Skill).where(Skill.category == category)
        skills = list(self._db.scalars(stmt).all())
        count = len(skills)
        for skill in skills:
            self._db.delete(skill)
        self._db.commit()
        return count

    def rename_category(self, old_category: str, new_category: str) -> int:
        """Rename category across all matching skills."""
        stmt = select(Skill).where(Skill.category == old_category)
        skills = list(self._db.scalars(stmt).all())
        count = len(skills)
        for skill in skills:
            skill.category = new_category
        self._db.commit()
        return count
