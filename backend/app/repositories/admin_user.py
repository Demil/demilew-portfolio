from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.admin_user import AdminUser
from app.repositories.base import BaseRepository


class AdminUserRepository(BaseRepository[AdminUser]):
    def __init__(self, db: Session) -> None:
        super().__init__(AdminUser, db)

    def get_by_email(self, email: str) -> AdminUser | None:
        stmt = select(AdminUser).where(AdminUser.email == email.lower())
        return self._db.scalars(stmt).first()

    def has_any_admin(self) -> bool:
        stmt = select(func.count(AdminUser.id))
        return (self._db.scalar(stmt) or 0) > 0

    def count(self) -> int:
        stmt = select(func.count(AdminUser.id))
        return self._db.scalar(stmt) or 0

    def create_admin(self, email: str, password_hash: str) -> AdminUser:
        return self._create(
            email=email.lower(),
            password_hash=password_hash,
            is_active=True,
        )

