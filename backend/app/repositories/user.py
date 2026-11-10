from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base import BaseRepository
from app.schemas.user import UserUpdate


class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session) -> None:
        super().__init__(User, db)

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def get_by_email(self, email: str) -> User | None:
        """Look up a user by e-mail address (case-sensitive)."""
        stmt = select(User).where(User.email == email)
        return self._db.scalars(stmt).first()

    def has_any_user(self) -> bool:
        """Return True if at least one user exists (used to guard first-time registration)."""
        stmt = select(User).limit(1)
        return self._db.scalars(stmt).first() is not None

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def create(self, email: str, hashed_password: str) -> User:
        """Create and persist a new user. Password must already be hashed."""
        return self._create(email=email, hashed_password=hashed_password, is_admin=True)

    def update(self, user: User, schema: UserUpdate, hashed_password: str | None = None) -> User:
        """Partially update a user. Pass hashed_password when the caller wants to change it."""
        data = schema.model_dump(exclude_unset=True, exclude={"password"})
        if hashed_password is not None:
            data["hashed_password"] = hashed_password
        return self._update(user, data)

