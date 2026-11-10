"""Administrator Authentication Router — Phase 3 (Authentication & Admin Foundation).

Implements Argon2id authentication, HTTP-only session cookies, CSRF protection,
login rate limiting, and single-admin initialization policy.
"""
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.csrf import CSRF_COOKIE_NAME, generate_csrf_token
from app.core.deps import get_current_admin, get_db, require_admin
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models.admin_user import AdminUser
from app.schemas.admin_user import (
    AdminSetupStatus,
    AdminUserCreate,
    AdminUserLogin,
    AdminUserRead,
    TokenResponse,
)
from app.schemas.auth import RefreshTokenRequest
from app.services.admin_auth import AdminAuthService

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_SECURE = settings.APP_ENV == "production"
COOKIE_SAMESITE = "lax"
ACCESS_TOKEN_MAX_AGE = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
REFRESH_TOKEN_MAX_AGE = settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400


def _set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str,
    csrf_token: str,
) -> None:
    """Set secure session cookies on the HTTP response."""
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=REFRESH_TOKEN_MAX_AGE,
        path="/api/v1/auth",
    )
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=csrf_token,
        httponly=False,  # Accessible to client JS for double-submit header
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    """Clear all session cookies."""
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/api/v1/auth")
    response.delete_cookie(key=CSRF_COOKIE_NAME, path="/")


# ── Bootstrap & Setup ─────────────────────────────────────────────────────────

@router.get(
    "/setup-status",
    response_model=AdminSetupStatus,
    summary="Check if platform has been initialized with an administrator",
)
def get_setup_status(db: Session = Depends(get_db)) -> AdminSetupStatus:
    is_init = AdminAuthService(db).is_initialized()
    return AdminSetupStatus(is_initialized=is_init)


@router.post(
    "/setup",
    response_model=AdminUserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Initial administrator setup (first run only)",
)
def setup_first_admin(
    schema: AdminUserCreate,
    db: Session = Depends(get_db),
) -> AdminUserRead:
    admin = AdminAuthService(db).setup_initial_admin(schema)
    return admin  # type: ignore[return-value]


# ── Session & Login ───────────────────────────────────────────────────────────

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Administrator login with Argon2id, rate limiting, and HTTP-only cookies",
)
def login(
    schema: AdminUserLogin,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> TokenResponse:
    client_ip = request.client.host if request.client else "unknown"
    admin = AdminAuthService(db).authenticate_admin(schema, client_ip=client_ip)

    access_token = create_access_token(admin.id)
    refresh_token = create_refresh_token(admin.id)
    csrf_token = generate_csrf_token()

    _set_auth_cookies(response, access_token, refresh_token, csrf_token)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=AdminUserRead.model_validate(admin),
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access session via refresh token or cookie",
)
def refresh_session(
    request: Request,
    response: Response,
    schema: RefreshTokenRequest | None = None,
    db: Session = Depends(get_db),
) -> TokenResponse:
    # Accept token from request body or cookie
    token: str | None = None
    if schema and schema.refresh_token:
        token = schema.refresh_token
    else:
        token = request.cookies.get("refresh_token")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    try:
        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise credentials_exception
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            raise credentials_exception
        admin_id = int(user_id_raw)
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception

    admin = AdminAuthService(db).get_by_id_or_404(admin_id)

    new_access_token = create_access_token(admin.id)
    new_refresh_token = create_refresh_token(admin.id)
    csrf_token = generate_csrf_token()

    _set_auth_cookies(response, new_access_token, new_refresh_token, csrf_token)

    return TokenResponse(
        access_token=new_access_token,
        token_type="bearer",
        user=AdminUserRead.model_validate(admin),
    )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Clear authentication cookies and end administrator session",
)
def logout(response: Response) -> dict[str, str]:
    _clear_auth_cookies(response)
    return {"message": "Logged out successfully"}


@router.get(
    "/me",
    response_model=AdminUserRead,
    summary="Get authenticated administrator identity",
)
def get_me(current_admin: AdminUser = Depends(get_current_admin)) -> AdminUserRead:
    return AdminUserRead.model_validate(current_admin)


# ── Administrative Management ─────────────────────────────────────────────────

@router.post(
    "/admin-users",
    response_model=AdminUserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a secondary administrator (existing admin only)",
    dependencies=[Depends(require_admin)],
)
def create_admin_user(
    schema: AdminUserCreate,
    db: Session = Depends(get_db),
) -> AdminUserRead:
    admin = AdminAuthService(db).create_secondary_admin(schema)
    return admin  # type: ignore[return-value]
