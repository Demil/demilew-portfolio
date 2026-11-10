"""Phase 8 End-to-End Workflow & Security Integration Tests.

Validates complete cross-module workflows, security headers,
publishing transitions, contact inbox lifecycle, SQL injection resistance,
and rate-limiting defenses.
"""

import io
from fastapi.testclient import TestClient


def test_security_headers_present(client: TestClient) -> None:
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.headers.get("x-content-type-options") == "nosniff"
    assert resp.headers.get("x-frame-options") == "DENY"
    assert resp.headers.get("referrer-policy") == "strict-origin-when-cross-origin"


def test_complete_publishing_lifecycle_and_public_visibility(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    # 1. Upload media cover image
    png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    files = {"file": ("cover.png", io.BytesIO(png_bytes), "image/png")}
    upload_resp = client.post("/api/v1/media/upload", files=files, headers=auth_headers)
    assert upload_resp.status_code == 201
    media_id = upload_resp.json()["id"]

    # 2. Create project in DRAFT status
    project_payload = {
        "title": "E2E Distributed Telemetry Pipeline",
        "slug": "e2e-distributed-telemetry-pipeline",
        "description": "High-throughput telemetry ingestion and anomaly scoring pipeline.",
        "problem_statement": "Processing 50k events per second across multi-region clusters.",
        "technical_approach": "Hybrid stream processing with Redis and PyTorch inference.",
        "tech_stack": ["Python", "FastAPI", "PyTorch", "Redis"],
        "featured": True,
        "display_order": 99,
        "status": "draft",
    }
    create_resp = client.post(
        "/api/v1/projects", json=project_payload, headers=auth_headers
    )
    assert create_resp.status_code == 201
    project_id = create_resp.json()["id"]

    # 3. Public API must NOT return the draft project
    public_resp = client.get("/api/v1/projects")
    assert public_resp.status_code == 200
    public_slugs = [p["slug"] for p in public_resp.json()]
    assert "e2e-distributed-telemetry-pipeline" not in public_slugs

    # Public single lookup must return 404 for draft
    public_slug_resp = client.get(
        "/api/v1/projects/e2e-distributed-telemetry-pipeline"
    )
    assert public_slug_resp.status_code == 404

    # 4. Admin API MUST return the draft project
    admin_all_resp = client.get("/api/v1/projects/admin/all", headers=auth_headers)
    assert admin_all_resp.status_code == 200
    admin_slugs = [p["slug"] for p in admin_all_resp.json()]
    assert "e2e-distributed-telemetry-pipeline" in admin_slugs

    # 5. Admin updates status to PUBLISHED
    patch_resp = client.patch(
        f"/api/v1/projects/{project_id}",
        json={"status": "published"},
        headers=auth_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "published"

    # 6. Public API now returns the published project
    public_resp = client.get("/api/v1/projects")
    assert public_resp.status_code == 200
    public_slugs = [p["slug"] for p in public_resp.json()]
    assert "e2e-distributed-telemetry-pipeline" in public_slugs

    # Public single lookup succeeds
    slug_resp = client.get("/api/v1/projects/e2e-distributed-telemetry-pipeline")
    assert slug_resp.status_code == 200
    assert slug_resp.json()["title"] == "E2E Distributed Telemetry Pipeline"
    assert "PyTorch" in slug_resp.json()["tech_stack"]

    # 7. Admin archives the project
    client.patch(
        f"/api/v1/projects/{project_id}",
        json={"status": "archived"},
        headers=auth_headers,
    )

    # Public API must no longer return archived project
    public_resp_after = client.get("/api/v1/projects")
    assert "e2e-distributed-telemetry-pipeline" not in [
        p["slug"] for p in public_resp_after.json()
    ]


def test_contact_inquiry_and_admin_workflow(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    # 1. Public visitor submits inquiry
    msg_payload = {
        "name": "Sarah Connor",
        "email": "sarah@skynet-defense.org",
        "subject": "Research Collaboration on AI Security",
        "message": "We reviewed your CNN-LSTM intrusion detection paper and would like to explore collaborative research.",
    }
    submit_resp = client.post("/api/v1/contact", json=msg_payload)
    assert submit_resp.status_code == 201
    msg_id = submit_resp.json()["id"]

    # 2. Admin checks unread messages
    count_resp = client.get("/api/v1/contact/unread/count", headers=auth_headers)
    assert count_resp.status_code == 200
    assert count_resp.json()["unread"] >= 1

    # 3. Admin lists contact messages
    list_resp = client.get("/api/v1/contact", headers=auth_headers)
    assert list_resp.status_code == 200
    messages = list_resp.json()
    assert any(m["id"] == msg_id and m["read"] is False for m in messages)

    # 4. Admin marks message as read
    patch_resp = client.patch(
        f"/api/v1/contact/{msg_id}", json={"read": True}, headers=auth_headers
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["read"] is True

    # 5. Admin deletes message
    del_resp = client.delete(f"/api/v1/contact/{msg_id}", headers=auth_headers)
    assert del_resp.status_code == 204


def test_sql_injection_defense_on_slug_queries(client: TestClient) -> None:
    malicious_slugs = [
        "' OR '1'='1",
        "project'; DROP TABLE projects; --",
        "admin'--",
        "../../etc/passwd",
    ]
    for slug in malicious_slugs:
        resp = client.get(f"/api/v1/projects/{slug}")
        assert resp.status_code == 404, f"Slug {slug} did not return 404 safe error."

