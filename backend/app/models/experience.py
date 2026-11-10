from datetime import date

from sqlalchemy import Boolean, Date, Enum, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin
from app.models.enums import PublishingStatus


class Experience(TimestampMixin, Base):
    """Professional employment history entry."""

    __tablename__ = "experiences"

    id: Mapped[int] = mapped_column(primary_key=True)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[PublishingStatus] = mapped_column(
        Enum(PublishingStatus, name="publishing_status"),
        default=PublishingStatus.PUBLISHED,
        nullable=False,
        index=True,
    )

    def __repr__(self) -> str:
        return f"<Experience id={self.id} role={self.role!r} company={self.company!r}>"
