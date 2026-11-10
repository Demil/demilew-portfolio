"""Phase 2 core database entities

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2026-11-07

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ── Enums ─────────────────────────────────────────────────────────────────
    # Create enum types safely with PL/pgSQL duplicate protection for PostgreSQL
    op.execute(
        "DO $$ BEGIN "
        "CREATE TYPE publishing_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED'); "
        "EXCEPTION WHEN duplicate_object THEN null; "
        "END $$;"
    )
    op.execute(
        "DO $$ BEGIN "
        "CREATE TYPE skill_category AS ENUM ('Frontend', 'Backend', 'DevOps', 'Other'); "
        "EXCEPTION WHEN duplicate_object THEN null; "
        "END $$;"
    )

    publishing_status_enum = sa.Enum("DRAFT", "PUBLISHED", "ARCHIVED", name="publishing_status", create_type=False)
    skill_category_enum = sa.Enum("Frontend", "Backend", "DevOps", "Other", name="skill_category", create_type=False)

    # ── 1. admin_users ────────────────────────────────────────────────────────
    op.create_table(
        "admin_users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_admin_users_email"), "admin_users", ["email"], unique=True)

    # ── 2. media ──────────────────────────────────────────────────────────────
    op.create_table(
        "media",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("file_size_bytes", sa.Integer(), nullable=False),
        sa.Column("alt_text", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # ── 3. profiles ───────────────────────────────────────────────────────────
    op.create_table(
        "profiles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("headline", sa.String(length=255), nullable=False),
        sa.Column("biography", sa.Text(), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("cv_media_id", sa.Integer(), nullable=True),
        sa.Column("profile_image_media_id", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["cv_media_id"], ["media.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["profile_image_media_id"], ["media.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )

    # ── 4. social_links ───────────────────────────────────────────────────────
    op.create_table(
        "social_links",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("profile_id", sa.Integer(), nullable=False),
        sa.Column("platform", sa.String(length=100), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("is_visible", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_social_links_profile_id"), "social_links", ["profile_id"])

    # ── 5. projects ───────────────────────────────────────────────────────────
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("problem_statement", sa.Text(), nullable=True),
        sa.Column("technical_approach", sa.Text(), nullable=True),
        sa.Column("github_url", sa.String(length=500), nullable=True),
        sa.Column("live_url", sa.String(length=500), nullable=True),
        sa.Column("image_media_id", sa.Integer(), nullable=True),
        sa.Column("featured", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "status",
            publishing_status_enum,
            server_default="DRAFT",
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["image_media_id"], ["media.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_projects_slug"), "projects", ["slug"], unique=True)
    op.create_index(op.f("ix_projects_status"), "projects", ["status"])

    # ── 6. project_technologies ───────────────────────────────────────────────
    op.create_table(
        "project_technologies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_project_technologies_project_id"), "project_technologies", ["project_id"])

    # ── 7. skills ─────────────────────────────────────────────────────────────
    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column(
            "category",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("icon_name", sa.String(length=100), nullable=True),
        sa.Column(
            "status",
            publishing_status_enum,
            server_default="PUBLISHED",
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_skills_category"), "skills", ["category"])
    op.create_index(op.f("ix_skills_status"), "skills", ["status"])

    # ── 8. experiences ────────────────────────────────────────────────────────
    op.create_table(
        "experiences",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("is_current", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "status",
            publishing_status_enum,
            server_default="PUBLISHED",
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_experiences_status"), "experiences", ["status"])

    # ── 9. education ──────────────────────────────────────────────────────────
    op.create_table(
        "education",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("institution", sa.String(length=255), nullable=False),
        sa.Column("degree", sa.String(length=255), nullable=False),
        sa.Column("field", sa.String(length=255), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("cgpa", sa.String(length=50), nullable=True),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "status",
            publishing_status_enum,
            server_default="PUBLISHED",
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_education_status"), "education", ["status"])

    # ── 10. research ──────────────────────────────────────────────────────────
    op.create_table(
        "research",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("methodology", sa.Text(), nullable=True),
        sa.Column("publication_url", sa.String(length=500), nullable=True),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "status",
            publishing_status_enum,
            server_default="DRAFT",
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_research_slug"), "research", ["slug"], unique=True)
    op.create_index(op.f("ix_research_status"), "research", ["status"])

    # ── 11. certificates ──────────────────────────────────────────────────────
    op.create_table(
        "certificates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("issuer", sa.String(length=255), nullable=False),
        sa.Column("issue_date", sa.Date(), nullable=False),
        sa.Column("credential_url", sa.String(length=500), nullable=True),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("media_id", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["media_id"], ["media.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )

    # ── 12. contact_messages ──────────────────────────────────────────────────
    op.create_table(
        "contact_messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("subject", sa.String(length=500), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("read", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # ── 13. site_settings ─────────────────────────────────────────────────────
    op.create_table(
        "site_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("key", sa.String(length=100), nullable=False),
        sa.Column("value", sa.Text(), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_site_settings_key"), "site_settings", ["key"], unique=True)


def downgrade() -> None:
    op.drop_table("site_settings")
    op.drop_table("contact_messages")
    op.drop_table("certificates")
    op.drop_table("research")
    op.drop_table("education")
    op.drop_table("experiences")
    op.drop_table("skills")
    op.drop_table("project_technologies")
    op.drop_table("projects")
    op.drop_table("social_links")
    op.drop_table("profiles")
    op.drop_table("media")
    op.drop_table("admin_users")
    op.execute("DROP TYPE IF EXISTS skill_category CASCADE;")
    op.execute("DROP TYPE IF EXISTS publishing_status CASCADE;")
