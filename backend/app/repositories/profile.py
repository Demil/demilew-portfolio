from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.profile import Profile
from app.models.social_link import SocialLink
from app.repositories.base import BaseRepository
from app.schemas.profile import ProfileCreate, ProfileUpdate, SocialLinkCreate, SocialLinkUpdate


class ProfileRepository(BaseRepository[Profile]):
    def __init__(self, db: Session) -> None:
        super().__init__(Profile, db)

    def get_first(self) -> Profile | None:
        """Return the owner profile record."""
        stmt = select(Profile)
        return self._db.scalars(stmt).first()

    def get_or_create_default(self) -> Profile:
        """Return existing profile or initialize Demilew Terefe's verified baseline profile."""
        profile = self.get_first()
        if not profile:
            profile = self._create(
                full_name="Demilew Terefe",
                headline="AI Developer & Researcher | Machine Learning Engineer",
                biography=(
                    "Software engineer and computer scientist with a focus on full-stack architecture, "
                    "distributed systems, and applied artificial intelligence."
                ),
                location="Addis Ababa, Ethiopia",
                email="demilew.terefe@example.com",
            )
        return profile

    def update_profile(self, profile: Profile, schema: ProfileUpdate) -> Profile:
        return self._update(profile, schema.model_dump(exclude_unset=True))

    # ── Social Links ──────────────────────────────────────────────────────────

    def get_social_link(self, link_id: int) -> SocialLink | None:
        return self._db.get(SocialLink, link_id)

    def create_social_link(self, profile_id: int, schema: SocialLinkCreate) -> SocialLink:
        link = SocialLink(profile_id=profile_id, **schema.model_dump())
        self._db.add(link)
        self._db.commit()
        self._db.refresh(link)
        return link

    def update_social_link(self, link: SocialLink, schema: SocialLinkUpdate) -> SocialLink:
        for field, value in schema.model_dump(exclude_unset=True).items():
            setattr(link, field, value)
        self._db.commit()
        self._db.refresh(link)
        return link

    def delete_social_link(self, link: SocialLink) -> None:
        self._db.delete(link)
        self._db.commit()

