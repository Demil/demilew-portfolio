import enum


class PublishingStatus(str, enum.Enum):
    """Lifecycle publishing state for portfolio content.
    Only content with PUBLISHED status is exposed to the public API.
    """
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class SkillCategory(str, enum.Enum):
    """Technical skill categorization."""
    FRONTEND = "Frontend"
    BACKEND = "Backend"
    DEVOPS = "DevOps"
    OTHER = "Other"

