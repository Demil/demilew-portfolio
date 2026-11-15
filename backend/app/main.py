import re
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
# Reads allowed origins from environment variable (comma-separated) or falls back to localhost.
# Supports both exact origins and wildcard patterns (e.g. https://*.vercel.app).
exact_origins: list[str] = []
regex_patterns: list[str] = []

for origin in settings.ALLOWED_ORIGINS.split(","):
    trimmed = origin.strip()
    if not trimmed:
        continue
    if "*" in trimmed:
        pattern = "^" + re.escape(trimmed).replace(r"\*", ".*") + "$"
        regex_patterns.append(pattern)
    else:
        exact_origins.append(trimmed)

if "http://localhost:3000" not in exact_origins:
    exact_origins.append("http://localhost:3000")

origin_regex = "|".join(regex_patterns) if regex_patterns else None

app.add_middleware(
    CORSMiddleware,
    allow_origins=exact_origins,
    allow_origin_regex=origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/", include_in_schema=False)
def root() -> dict[str, str]:
    return {
        "title": "Demilew Terefe Portfolio & Research API",
        "status": "online",
        "documentation": "/docs",
        "health": "/api/v1/health",
        "version": "1.0.0",
    }


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
