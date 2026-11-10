from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.research import Research
from app.repositories.research import ResearchRepository
from app.schemas.research import ResearchCreate, ResearchUpdate


class ResearchService:
    def __init__(self, db: Session) -> None:
        self._repo = ResearchRepository(db)

    def get_or_404(self, research_id: int) -> Research:
        item = self._repo.get(research_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Research initiative not found",
            )
        return item

    def get_by_slug_or_404(self, slug: str) -> Research:
        item = self._repo.get_by_slug(slug)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Research initiative not found",
            )
        return item

    def list_public(self) -> list[Research]:
        return self._repo.list_ordered(published_only=True)

    def list_all(self) -> list[Research]:
        return self._repo.list_ordered(published_only=False)

    def _assert_slug_free(self, slug: str, exclude_id: int | None = None) -> None:
        existing = self._repo.get_by_slug(slug)
        if existing and existing.id != exclude_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Research with slug '{slug}' already exists",
            )

    def create(self, schema: ResearchCreate) -> Research:
        self._assert_slug_free(schema.slug)
        return self._repo.create(schema)

    def update(self, research_id: int, schema: ResearchUpdate) -> Research:
        item = self.get_or_404(research_id)
        if schema.slug is not None:
            self._assert_slug_free(schema.slug, exclude_id=item.id)
        return self._repo.update(item, schema)

    def delete(self, research_id: int) -> None:
        item = self.get_or_404(research_id)
        self._repo.delete(item)

