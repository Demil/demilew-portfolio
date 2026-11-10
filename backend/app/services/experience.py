from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.repositories.experience import ExperienceRepository
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


class ExperienceService:
    def __init__(self, db: Session) -> None:
        self._repo = ExperienceRepository(db)

    def get_or_404(self, experience_id: int) -> Experience:
        exp = self._repo.get(experience_id)
        if not exp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Experience not found",
            )
        return exp

    def list_public(self) -> list[Experience]:
        return self._repo.list_ordered(published_only=True)

    def list_all(self) -> list[Experience]:
        return self._repo.list_ordered(published_only=False)

    def create(self, schema: ExperienceCreate) -> Experience:
        return self._repo.create(schema)

    def update(self, experience_id: int, schema: ExperienceUpdate) -> Experience:
        exp = self.get_or_404(experience_id)
        return self._repo.update(exp, schema)

    def delete(self, experience_id: int) -> None:
        exp = self.get_or_404(experience_id)
        self._repo.delete(exp)
