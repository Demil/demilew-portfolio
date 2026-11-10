"""Phase 3 Security & Authentication Test Suite.

Tests Argon2id hashing, initial bootstrap vs. public registration lockout,
HTTP-only session cookies, CSRF protection, login rate limiting, and session lifecycle.
"""
from fastapi.testclient import TestClient

from app.core.csrf import CSRF_COOKIE_NAME, CSRF_HEADER_NAME
from app.core.rate_limit import login_rate_limiter
from app.models.admin_user import AdminUser


def test_setup_status_and_first_admin_bootstrap(client: TestClient) -> None:
    # 1. Setup status initially False
    resp = client.get("/api/v1/auth/setup-status")
    assert resp.status_code == 200
    assert resp.json()["is_initialized"] is False

    # 2. First admin setup succeeds
    setup_payload = {"email": "firstadmin@example.com", "password": "SecurePassword123!"}
    resp = client.post("/api/v1/auth/setup", json=setup_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "firstadmin@example.com"
    assert data["is_active"] is True
    assert "password" not in data

    # 3. Setup status now True
    resp = client.get("/api/v1/auth/setup-status")
    assert resp.status_code == 200
    assert resp.json()["is_initialized"] is True

    # 4. Subsequent public setup is blocked (no public registration per Section 6.2)
    resp = client.post(
        "/api/v1/auth/setup",
        json={"email": "intruder@example.com", "password": "IntruderPassword123!"},
    )
    assert resp.status_code == 403


def test_login_cookies_and_csrf_tokens(client: TestClient, admin_user: AdminUser) -> None:
    login_rate_limiter.reset_all()

    # 1. Successful login sets HTTP-only cookies and emits CSRF token
    login_payload = {"email": "admin@example.com", "password": "adminpassword123"}
    resp = client.post("/api/v1/auth/login", json=login_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@example.com"

    # Verify cookies
    cookies = resp.cookies
    assert "access_token" in cookies
    assert "refresh_token" in cookies
    assert CSRF_COOKIE_NAME in cookies


def test_login_rate_limiting(client: TestClient, admin_user: AdminUser) -> None:
    login_rate_limiter.reset_all()

    # 5 failed attempts trigger 429
    for i in range(5):
        resp = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@example.com", "password": f"wrongpassword{i}"},
        )
        assert resp.status_code == 401

    # 6th attempt is rate-limited
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword123"},
    )
    assert resp.status_code == 429
    assert "Too many failed login attempts" in resp.json()["detail"]
    assert "Retry-After" in resp.headers

    login_rate_limiter.reset_all()


def test_csrf_protection_on_cookie_authenticated_mutations(
    client: TestClient, admin_user: AdminUser
) -> None:
    login_rate_limiter.reset_all()

    # 1. Login to establish session cookies
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword123"},
    )
    assert login_resp.status_code == 200
    csrf_token = login_resp.cookies.get(CSRF_COOKIE_NAME)
    assert csrf_token is not None

    # 2. State-changing request WITHOUT X-CSRF-Token is blocked with 403
    project_payload = {
        "title": "CSRF Guarded Project",
        "slug": "csrf-guarded-project",
        "description": "Testing CSRF token enforcement",
        "tech_stack": ["FastAPI", "React"],
    }
    resp = client.post("/api/v1/projects", json=project_payload)
    assert resp.status_code == 403
    assert "CSRF" in resp.json()["detail"]

    # 3. State-changing request WITH matching X-CSRF-Token header succeeds
    resp = client.post(
        "/api/v1/projects",
        json=project_payload,
        headers={CSRF_HEADER_NAME: csrf_token},
    )
    assert resp.status_code == 201
    created_id = resp.json()["id"]

    # 4. Clean up
    client.delete(f"/api/v1/projects/{created_id}", headers={CSRF_HEADER_NAME: csrf_token})


def test_session_refresh_and_logout(client: TestClient, admin_user: AdminUser) -> None:
    login_rate_limiter.reset_all()

    # Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword123"},
    )
    assert login_resp.status_code == 200

    # Refresh session
    refresh_resp = client.post("/api/v1/auth/refresh")
    assert refresh_resp.status_code == 200
    assert "access_token" in refresh_resp.json()

    # Logout
    logout_resp = client.post("/api/v1/auth/logout")
    assert logout_resp.status_code == 200
    assert logout_resp.json()["message"] == "Logged out successfully"


def test_admin_me_and_secondary_admin_creation(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    # 1. /auth/me returns current admin
    resp = client.get("/api/v1/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == "admin@example.com"

    # 2. Authenticated admin creates secondary admin
    sec_payload = {"email": "secondary@example.com", "password": "NewAdminPass123!"}
    resp = client.post("/api/v1/auth/admin-users", json=sec_payload, headers=auth_headers)
    assert resp.status_code == 201
    assert resp.json()["email"] == "secondary@example.com"

    # 3. Conflict on duplicate email
    resp = client.post("/api/v1/auth/admin-users", json=sec_payload, headers=auth_headers)
    assert resp.status_code == 409
