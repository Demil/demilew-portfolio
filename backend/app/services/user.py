"""UserService — password hashing, authentication, user lifecycle.

Uses the `bcrypt` library directly (passlib 1.7 is incompatible with bcrypt >= 4).
"""
import bcrypt
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session) -> None:
        self._repo = UserRepository(db)

    # ------------------------------------------------------------------
    # Password utilities
    # ------------------------------------------------------------------

    @staticmethod
    def hash_password(plain: str) -> str:
        """Return a bcrypt hash of the given plain-text password."""
        return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        """Return True if plain matches the stored bcrypt hash."""
        return bcrypt.checkpw(plain.encode(), hashed.encode())

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def has_any_user(self) -> bool:
        """True if at least one user exists in the database."""
        return self._repo.has_any_user()

    def get_or_404(self, user_id: int) -> User:
        user = self._repo.get(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    def get_by_email_or_401(self, email: str) -> User:
        user = self._repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        return user

    def authenticate(self, email: str, password: str) -> User:
        """Verify credentials and return the user, or raise 401."""
        user = self.get_by_email_or_401(email)
        if not self.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        return user

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    def create(self, schema: UserCreate) -> User:
        """Create a new admin user. Raises 409 if the email is already taken."""
        if self._repo.get_by_email(schema.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            )
        return self._repo.create(
            email=schema.email,
            hashed_password=self.hash_password(schema.password),
        )

    def update(self, user_id: int, schema: UserUpdate) -> User:
        """Partially update a user. Raises 409 if the new email is already taken."""
        user = self.get_or_404(user_id)
        if schema.email and schema.email != user.email:
            if self._repo.get_by_email(schema.email):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already in use by another account",
                )
        hashed = self.hash_password(schema.password) if schema.password else None
        return self._repo.update(user, schema, hashed_password=hashed)
