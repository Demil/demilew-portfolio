from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.education import Education
from app.repositories.education import EducationRepository
from app.schemas.education import EducationCreate, EducationUpdate


class EducationService:
    def __init__(self, db: Session) -> None:
        self._repo = EducationRepository(db)

    def get_or_404(self, education_id: int) -> Education:
        edu = self._repo.get(education_id)
        if not edu:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Education record not found",
            )
        return edu

    def list_public(self) -> list[Education]:
        return self._repo.list_ordered(published_only=True)

    def list_all(self) -> list[Education]:
        return self._repo.list_ordered(published_only=False)

    def create(self, schema: EducationCreate) -> Education:
        return self._repo.create(schema)

    def update(self, education_id: int, schema: EducationUpdate) -> Education:
        edu = self.get_or_404(education_id)
        return self._repo.update(edu, schema)

    def delete(self, education_id: int) -> None:
        edu = self.get_or_404(education_id)
        self._repo.delete(edu)
