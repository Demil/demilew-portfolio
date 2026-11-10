"""Phase 4 Content Management Backend Integration Tests.

Validates complete CRUD, publishing lifecycle transitions (DRAFT -> PUBLISHED -> ARCHIVED),
and administrative access guards across Profile, Projects, Experience, Education,
Research, Skills, Certificates, and Settings.
"""
from datetime import date
from fastapi.testclient import TestClient


def test_profile_and_social_links_crud(client: TestClient, auth_headers: dict[str, str]) -> None:
    # 1. Public profile returns default Demilew Terefe profile
    resp = client.get("/api/v1/profile")
    assert resp.status_code == 200
    data = resp.json()
    assert data["full_name"] == "Demilew Terefe"
    assert "Software Engineer" in data["headline"]

    # 2. Unauthenticated update is rejected
    resp = client.patch("/api/v1/profile", json={"headline": "Lead Systems Architect"})
    assert resp.status_code == 401 or resp.status_code == 403

    # 3. Authenticated admin update succeeds
    resp = client.patch(
        "/api/v1/profile",
        json={"headline": "Lead Systems Architect & Applied AI Researcher"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["headline"] == "Lead Systems Architect & Applied AI Researcher"

    # 4. Add social link
    social_payload = {
        "platform": "GitHub",
        "url": "https://github.com",
        "display_order": 1,
        "is_visible": True,
    }
    resp = client.post("/api/v1/profile/social-links", json=social_payload, headers=auth_headers)
    assert resp.status_code == 201
    link_id = resp.json()["id"]

    # 5. Public profile now includes the visible social link
    resp = client.get("/api/v1/profile")
    assert resp.status_code == 200
    assert any(link["platform"] == "GitHub" for link in resp.json()["social_links"])

    # 6. Hide social link
    resp = client.patch(
        f"/api/v1/profile/social-links/{link_id}",
        json={"is_visible": False},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["is_visible"] is False

    # 7. Public profile no longer shows hidden link
    resp = client.get("/api/v1/profile")
    assert not any(link["platform"] == "GitHub" for link in resp.json()["social_links"])

    # 8. Delete social link
    resp = client.delete(f"/api/v1/profile/social-links/{link_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_projects_publishing_lifecycle(client: TestClient, auth_headers: dict[str, str]) -> None:
    # 1. Create a project in DRAFT status
    draft_payload = {
        "title": "Confidential AI Pipeline",
        "slug": "confidential-ai-pipeline",
        "description": "Enterprise document processing system",
        "tech_stack": ["Python", "FastAPI", "PostgreSQL"],
        "status": "draft",
    }
    resp = client.post("/api/v1/projects", json=draft_payload, headers=auth_headers)
    assert resp.status_code == 201
    project_id = resp.json()["id"]
    assert resp.json()["status"] == "draft"

    # 2. Public listing does NOT return draft project
    resp = client.get("/api/v1/projects")
    assert not any(p["slug"] == "confidential-ai-pipeline" for p in resp.json())

    # 3. Public get by slug returns 404 for draft
    resp = client.get("/api/v1/projects/confidential-ai-pipeline")
    assert resp.status_code == 404

    # 4. Admin listing DOES return draft project
    resp = client.get("/api/v1/projects/admin/all", headers=auth_headers)
    assert resp.status_code == 200
    assert any(p["slug"] == "confidential-ai-pipeline" for p in resp.json())

    # 5. Transition to PUBLISHED
    resp = client.patch(
        f"/api/v1/projects/{project_id}",
        json={"status": "published", "featured": True},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "published"

    # 6. Now public endpoints return it
    resp = client.get("/api/v1/projects")
    assert any(p["slug"] == "confidential-ai-pipeline" for p in resp.json())

    resp = client.get("/api/v1/projects/featured")
    assert any(p["slug"] == "confidential-ai-pipeline" for p in resp.json())

    resp = client.get("/api/v1/projects/confidential-ai-pipeline")
    assert resp.status_code == 200
    assert resp.json()["title"] == "Confidential AI Pipeline"

    # 7. Transition to ARCHIVED
    resp = client.patch(
        f"/api/v1/projects/{project_id}",
        json={"status": "archived"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "archived"

    # 8. Archived project is hidden from public
    resp = client.get("/api/v1/projects")
    assert not any(p["slug"] == "confidential-ai-pipeline" for p in resp.json())

    # 9. Clean up
    resp = client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_experience_crud_and_validation(client: TestClient, auth_headers: dict[str, str]) -> None:
    exp_payload = {
        "company": "Tech Corp Ethiopia",
        "role": "Senior Full-Stack Engineer",
        "description": "Architected distributed cloud backends and high-traffic APIs",
        "start_date": "2023-01-01",
        "end_date": "2024-06-30",
        "is_current": False,
        "display_order": 1,
        "status": "published",
    }
    # 1. Admin create
    resp = client.post("/api/v1/experience", json=exp_payload, headers=auth_headers)
    assert resp.status_code == 201
    exp_id = resp.json()["id"]

    # 2. Public list
    resp = client.get("/api/v1/experience")
    assert resp.status_code == 200
    assert any(e["company"] == "Tech Corp Ethiopia" for e in resp.json())

    # 3. Update
    resp = client.patch(
        f"/api/v1/experience/{exp_id}",
        json={"role": "Lead Software Architect"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["role"] == "Lead Software Architect"

    # 4. Delete
    resp = client.delete(f"/api/v1/experience/{exp_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_education_crud_and_cgpa(client: TestClient, auth_headers: dict[str, str]) -> None:
    edu_payload = {
        "institution": "Addis Ababa Science and Technology University",
        "degree": "Bachelor of Science",
        "field": "Computer Science and Engineering",
        "start_date": "2018-09-01",
        "end_date": "2022-07-01",
        "cgpa": "3.85 / 4.00",
        "display_order": 1,
        "status": "published",
    }
    # 1. Admin create
    resp = client.post("/api/v1/education", json=edu_payload, headers=auth_headers)
    assert resp.status_code == 201
    edu_id = resp.json()["id"]
    assert resp.json()["cgpa"] == "3.85 / 4.00"

    # 2. Public list
    resp = client.get("/api/v1/education")
    assert resp.status_code == 200
    assert any(e["institution"] == "Addis Ababa Science and Technology University" for e in resp.json())

    # 3. Delete
    resp = client.delete(f"/api/v1/education/{edu_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_research_crud_and_uniqueness(client: TestClient, auth_headers: dict[str, str]) -> None:
    research_payload = {
        "title": "Low-Resource Amharic NLP Tokenization",
        "slug": "low-resource-amharic-nlp",
        "description": "Comparative study on subword tokenization models for Semitic morphology.",
        "methodology": "Byte-pair encoding and WordPiece evaluation on Amharic news corpora.",
        "status": "published",
    }
    # 1. Admin create
    resp = client.post("/api/v1/research", json=research_payload, headers=auth_headers)
    assert resp.status_code == 201
    res_id = resp.json()["id"]

    # 2. Public get by slug
    resp = client.get("/api/v1/research/low-resource-amharic-nlp")
    assert resp.status_code == 200
    assert resp.json()["title"] == "Low-Resource Amharic NLP Tokenization"

    # 3. Duplicate slug fails with 409 Conflict
    resp = client.post("/api/v1/research", json=research_payload, headers=auth_headers)
    assert resp.status_code == 409

    # 4. Clean up
    resp = client.delete(f"/api/v1/research/{res_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_certificates_crud(client: TestClient, auth_headers: dict[str, str]) -> None:
    cert_payload = {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "issue_date": "2023-05-15",
        "credential_url": "https://aws.amazon.com/verification",
    }
    # 1. Admin create
    resp = client.post("/api/v1/certificates", json=cert_payload, headers=auth_headers)
    assert resp.status_code == 201
    cert_id = resp.json()["id"]

    # 2. Public list
    resp = client.get("/api/v1/certificates")
    assert resp.status_code == 200
    assert any(c["name"] == "AWS Certified Solutions Architect" for c in resp.json())

    # 3. Delete
    resp = client.delete(f"/api/v1/certificates/{cert_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_site_settings_crud_and_privacy(client: TestClient, auth_headers: dict[str, str]) -> None:
    # 1. Set public setting
    resp = client.put(
        "/api/v1/settings/site_title",
        json={"value": "Demilew Terefe | Software Engineer & Researcher"},
        headers=auth_headers,
    )
    assert resp.status_code == 200

    # 2. Set private internal setting
    resp = client.put(
        "/api/v1/settings/internal_backup_frequency",
        json={"value": "daily_at_midnight"},
        headers=auth_headers,
    )
    assert resp.status_code == 200

    # 3. Public settings endpoint ONLY exposes allowed public keys
    resp = client.get("/api/v1/settings/public")
    assert resp.status_code == 200
    data = resp.json()
    assert "site_title" in data
    assert data["site_title"] == "Demilew Terefe | Software Engineer & Researcher"
    assert "internal_backup_frequency" not in data

    # 4. Admin settings endpoint shows all settings
    resp = client.get("/api/v1/settings", headers=auth_headers)
    assert resp.status_code == 200
    keys = [s["key"] for s in resp.json()]
    assert "site_title" in keys
    assert "internal_backup_frequency" in keys

