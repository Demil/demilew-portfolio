from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_admin
from app.schemas.research import ResearchCreate, ResearchRead, ResearchUpdate
from app.services.research import ResearchService

router = APIRouter(prefix="/research", tags=["research"])


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[ResearchRead], summary="List published research initiatives")
def list_research(db: Session = Depends(get_db)) -> list[ResearchRead]:
    return ResearchService(db).list_public()  # type: ignore[return-value]


@router.get("/{slug}", response_model=ResearchRead, summary="Get research initiative by slug")
def get_research_by_slug(slug: str, db: Session = Depends(get_db)) -> ResearchRead:
    return ResearchService(db).get_by_slug_or_404(slug)  # type: ignore[return-value]


# ── Admin (🔒 Protected) ──────────────────────────────────────────────────────

@router.get(
    "/admin/all",
    response_model=list[ResearchRead],
    summary="List all research initiatives including drafts for administration",
    dependencies=[Depends(require_admin)],
)
def list_all_research_admin(db: Session = Depends(get_db)) -> list[ResearchRead]:
    return ResearchService(db).list_all()  # type: ignore[return-value]


@router.post(
    "",
    response_model=ResearchRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a research initiative",
    dependencies=[Depends(require_admin)],
)
def create_research(
    schema: ResearchCreate,
    db: Session = Depends(get_db),
) -> ResearchRead:
    return ResearchService(db).create(schema)  # type: ignore[return-value]


@router.patch(
    "/{research_id}",
    response_model=ResearchRead,
    summary="Update a research initiative",
    dependencies=[Depends(require_admin)],
)
def update_research(
    research_id: int,
    schema: ResearchUpdate,
    db: Session = Depends(get_db),
) -> ResearchRead:
    return ResearchService(db).update(research_id, schema)  # type: ignore[return-value]


@router.delete(
    "/{research_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a research initiative",
    dependencies=[Depends(require_admin)],
)
def delete_research(research_id: int, db: Session = Depends(get_db)) -> None:
    ResearchService(db).delete(research_id)

