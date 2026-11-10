"""AdminAuthService — business logic for administrator authentication, setup, and credentials."""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.hasher import hash_password, needs_rehash, verify_password
from app.core.rate_limit import login_rate_limiter
from app.models.admin_user import AdminUser
from app.repositories.admin_user import AdminUserRepository
from app.schemas.admin_user import AdminUserCreate, AdminUserLogin


class AdminAuthService:
    def __init__(self, db: Session) -> None:
        self._repo = AdminUserRepository(db)

    def is_initialized(self) -> bool:
        """True if at least one administrator account exists."""
        return self._repo.has_any_admin()

    def setup_initial_admin(self, schema: AdminUserCreate) -> AdminUser:
        """Bootstrap the first administrator account.

        Per Section 6.2 (Admin User Policy):
        Do not implement public registration. Once the initial admin is registered,
        public registration is permanently disabled.
        """
        if self._repo.has_any_admin():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Platform administrator already initialized. Public registration is disabled.",
            )

        hashed = hash_password(schema.password)
        return self._repo.create_admin(email=schema.email, password_hash=hashed)

    def authenticate_admin(self, schema: AdminUserLogin, client_ip: str) -> AdminUser:
        """Verify administrator credentials with rate limiting and Argon2id."""
        rate_limit_key = f"{client_ip}:{schema.email.lower()}"
        login_rate_limiter.check_rate_limit(rate_limit_key)

        admin = self._repo.get_by_email(schema.email)
        if not admin or not admin.is_active:
            login_rate_limiter.record_failure(rate_limit_key)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        if not verify_password(schema.password, admin.password_hash):
            login_rate_limiter.record_failure(rate_limit_key)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Check if hash parameters should be upgraded
        if needs_rehash(admin.password_hash):
            admin.password_hash = hash_password(schema.password)
            self._repo._db.commit()

        login_rate_limiter.record_success(rate_limit_key)
        return admin

    def create_secondary_admin(self, schema: AdminUserCreate) -> AdminUser:
        """Create an additional administrator. Only allowed by an existing admin."""
        if self._repo.get_by_email(schema.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An administrator with this email already exists",
            )
        hashed = hash_password(schema.password)
        return self._repo.create_admin(email=schema.email, password_hash=hashed)

    def get_by_id_or_404(self, admin_id: int) -> AdminUser:
        admin = self._repo.get(admin_id)
        if not admin or not admin.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Administrator not found or inactive",
            )
        return admin

