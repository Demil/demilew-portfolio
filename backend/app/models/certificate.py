from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin


class Certificate(TimestampMixin, Base):
    """Professional certifications and verified credentials."""

    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    issuer: Mapped[str] = mapped_column(String(255), nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    credential_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    media_id: Mapped[int | None] = mapped_column(
        ForeignKey("media.id", ondelete="SET NULL"), nullable=True
    )

    def __repr__(self) -> str:
        return f"<Certificate id={self.id} name={self.name!r} issuer={self.issuer!r}>"

