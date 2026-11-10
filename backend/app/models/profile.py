from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.social_link import SocialLink


class Profile(TimestampMixin, Base):
    """Personal owner profile information."""

    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    headline: Mapped[str] = mapped_column(String(255), nullable=False)
    biography: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    
    cv_media_id: Mapped[int | None] = mapped_column(
        ForeignKey("media.id", ondelete="SET NULL"), nullable=True
    )
    profile_image_media_id: Mapped[int | None] = mapped_column(
        ForeignKey("media.id", ondelete="SET NULL"), nullable=True
    )

    social_links: Mapped[list["SocialLink"]] = relationship(
        "SocialLink", back_populates="profile", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Profile id={self.id} full_name={self.full_name!r}>"

