from sqlalchemy import Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin
from app.models.enums import PublishingStatus, SkillCategory


class Skill(TimestampMixin, Base):
    """Technical skill entity categorized by engineering domain."""

    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    icon_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[PublishingStatus] = mapped_column(
        Enum(PublishingStatus, name="publishing_status"),
        default=PublishingStatus.PUBLISHED,
        nullable=False,
        index=True,
    )

    def __repr__(self) -> str:
        return f"<Skill id={self.id} name={self.name!r} category={self.category!r}>"
