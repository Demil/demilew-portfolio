from collections.abc import Generator

import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.csrf import validate_csrf
from app.core.database import SessionLocal
from app.core.security import decode_token
from app.models.admin_user import AdminUser
from app.services.admin_auth import AdminAuthService

security = HTTPBearer(auto_error=False)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_admin(
    request: Request,
    bearer_creds: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Validate administrator identity from either Bearer token or HTTP-only session cookie.

    Applies CSRF validation when session cookies are used on state-changing requests.
    """
    token: str | None = None

    if bearer_creds is not None and bearer_creds.credentials:
        token = bearer_creds.credentials
    else:
        # Check HTTP-only cookie
        token = request.cookies.get("access_token")
        if token:
            # Enforce CSRF token verification for cookie-authenticated mutations
            validate_csrf(request)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    try:
        payload = decode_token(token)
        token_type: str = payload.get("type", "")
        if token_type != "access":
            raise credentials_exception
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            raise credentials_exception
        user_id = int(user_id_raw)
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception

    try:
        admin = AdminAuthService(db).get_by_id_or_404(user_id)
    except HTTPException:
        raise credentials_exception

    return admin


def require_admin(admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    """Ensure the authenticated user is an active platform administrator."""
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive administrator account",
        )
    return admin


# Backward-compatible alias
get_current_user = get_current_admin
