from sqlalchemy import Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin
from app.models.enums import PublishingStatus


class Research(TimestampMixin, Base):
    """Academic and applied research initiatives and papers."""

    __tablename__ = "research"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    methodology: Mapped[str | None] = mapped_column(Text, nullable=True)
    publication_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[PublishingStatus] = mapped_column(
        Enum(PublishingStatus, name="publishing_status"),
        default=PublishingStatus.DRAFT,
        nullable=False,
        index=True,
    )

    def __repr__(self) -> str:
        return f"<Research id={self.id} slug={self.slug!r} status={self.status}>"

