from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.enums import PublishingStatus
from app.models.research import Research
from app.repositories.base import BaseRepository
from app.schemas.research import ResearchCreate, ResearchUpdate


class ResearchRepository(BaseRepository[Research]):
    def __init__(self, db: Session) -> None:
        super().__init__(Research, db)

    def get_by_slug(self, slug: str) -> Research | None:
        stmt = select(Research).where(Research.slug == slug)
        return self._db.scalars(stmt).first()

    def list_ordered(self, published_only: bool = True) -> list[Research]:
        stmt = select(Research)
        if published_only:
            stmt = stmt.where(Research.status == PublishingStatus.PUBLISHED)
        stmt = stmt.order_by(Research.display_order, Research.created_at.desc())
        return list(self._db.scalars(stmt).all())

    def create(self, schema: ResearchCreate) -> Research:
        return self._create(**schema.model_dump())

    def update(self, item: Research, schema: ResearchUpdate) -> Research:
        return self._update(item, schema.model_dump(exclude_unset=True))

