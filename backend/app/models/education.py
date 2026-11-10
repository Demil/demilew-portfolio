from datetime import date

from sqlalchemy import Date, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin
from app.models.enums import PublishingStatus


class Education(TimestampMixin, Base):
    """Academic credential entry."""

    __tablename__ = "education"

    id: Mapped[int] = mapped_column(primary_key=True)
    institution: Mapped[str] = mapped_column(String(255), nullable=False)
    degree: Mapped[str] = mapped_column(String(255), nullable=False)
    field: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    cgpa: Mapped[str | None] = mapped_column(String(50), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[PublishingStatus] = mapped_column(
        Enum(PublishingStatus, name="publishing_status"),
        default=PublishingStatus.PUBLISHED,
        nullable=False,
        index=True,
    )

    def __repr__(self) -> str:
        return f"<Education id={self.id} degree={self.degree!r} institution={self.institution!r}>"
