from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin
from app.models.enums import PublishingStatus


class Project(TimestampMixin, Base):
    """Portfolio project showcasing software engineering and AI work."""

    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    problem_statement: Mapped[str | None] = mapped_column(Text, nullable=True)
    technical_approach: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    live_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    demo_video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    image_media_id: Mapped[int | None] = mapped_column(
        ForeignKey("media.id", ondelete="SET NULL"), nullable=True
    )
    
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[PublishingStatus] = mapped_column(
        Enum(PublishingStatus, name="publishing_status"),
        default=PublishingStatus.DRAFT,
        nullable=False,
        index=True,
    )

    technologies: Mapped[list["ProjectTechnology"]] = relationship(
        "ProjectTechnology", back_populates="project", cascade="all, delete-orphan", lazy="selectin"
    )

    @property
    def tech_stack(self) -> list[str]:
        return [t.name for t in self.technologies] if self.technologies else []

    def __repr__(self) -> str:
        return f"<Project id={self.id} slug={self.slug!r} status={self.status}>"


class ProjectTechnology(Base):
    """Normalized relational technologies used by a project."""

    __tablename__ = "project_technologies"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    project: Mapped["Project"] = relationship("Project", back_populates="technologies")

    def __repr__(self) -> str:
        return f"<ProjectTechnology id={self.id} name={self.name!r}>"
