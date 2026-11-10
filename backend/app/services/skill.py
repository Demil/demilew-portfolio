"""SkillService — business logic for skills."""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.repositories.skill import SkillRepository
from app.schemas.skill import SkillCreate, SkillUpdate


class SkillService:
    def __init__(self, db: Session) -> None:
        self._repo = SkillRepository(db)

    def get_or_404(self, skill_id: int) -> Skill:
        skill = self._repo.get(skill_id)
        if not skill:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
        return skill

    def list_public(self) -> list[Skill]:
        return self._repo.list_ordered(published_only=True)

    def list_all_admin(self) -> list[Skill]:
        return self._repo.list_ordered(published_only=False)

    def list_by_category(self, category: str, published_only: bool = True) -> list[Skill]:
        return self._repo.list_by_category(category, published_only=published_only)

    def create(self, schema: SkillCreate) -> Skill:
        return self._repo.create(schema)

    def update(self, skill_id: int, schema: SkillUpdate) -> Skill:
        skill = self.get_or_404(skill_id)
        return self._repo.update(skill, schema)

    def delete(self, skill_id: int) -> None:
        skill = self.get_or_404(skill_id)
        self._repo.delete(skill)

    def delete_category(self, category: str) -> int:
        return self._repo.delete_by_category(category)

    def rename_category(self, old_category: str, new_category: str) -> int:
        return self._repo.rename_category(old_category, new_category)
