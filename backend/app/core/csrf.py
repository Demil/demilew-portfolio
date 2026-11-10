"""CSRF protection for cookie-authenticated mutations per Section 7 requirements."""
import secrets
from fastapi import HTTPException, Request, status

CSRF_COOKIE_NAME = "csrf_token"
CSRF_HEADER_NAME = "x-csrf-token"
SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


def generate_csrf_token() -> str:
    """Generate a high-entropy URL-safe cryptographic CSRF token."""
    return secrets.token_urlsafe(32)


def validate_csrf(request: Request) -> None:
    """Validate CSRF token if request is cookie-authenticated and state-changing.

    Bearer-authenticated requests (via Authorization header) are immune to CSRF
    because browser ambient credentials are not used. Cookie-authenticated
    state-changing requests (POST, PUT, PATCH, DELETE) must provide a matching
    X-CSRF-Token header.
    """
    if request.method in SAFE_METHODS:
        return

    # If the client authenticates via Authorization header, ambient cookies are not relied upon
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return

    # If authenticated via cookie, enforce CSRF
    access_cookie = request.cookies.get("access_token")
    if not access_cookie:
        return

    csrf_cookie = request.cookies.get(CSRF_COOKIE_NAME)
    csrf_header = request.headers.get(CSRF_HEADER_NAME)

    if not csrf_cookie or not csrf_header or not secrets.compare_digest(csrf_cookie, csrf_header):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token validation failed",
        )

