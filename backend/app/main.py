from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title="Demilew Terefe Portfolio & CMS API",
    version="1.0.0",
    description="Backend API for Demilew Terefe's personal portfolio and genuine CMS administration platform.",
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects defense-in-depth security headers on all HTTP responses."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response


# Security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# CORS configuration per Section 7 security requirements
# Reads allowed origins from environment variable (comma-separated) or falls back to localhost
parsed_origins = [
    origin.strip()
    for origin in settings.ALLOWED_ORIGINS.split(",")
    if origin.strip()
]
if "http://localhost:3000" not in parsed_origins:
    parsed_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=parsed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
