from fastapi.testclient import TestClient


def test_public_projects_and_admin_guard(client: TestClient, auth_headers: dict[str, str]) -> None:
    # Public list is accessible and returns empty list initially
    resp = client.get("/api/v1/projects")
    assert resp.status_code == 200
    assert resp.json() == []

    # Unauthenticated create is blocked
    project_payload = {
        "title": "Portfolio Website",
        "slug": "portfolio-website",
        "description": "Full-stack personal portfolio",
        "tech_stack": ["FastAPI", "Next.js", "PostgreSQL"],
        "featured": True,
        "display_order": 1,
    }
    resp = client.post("/api/v1/projects", json=project_payload)
    assert resp.status_code == 401 or resp.status_code == 403

    # Authenticated admin create succeeds
    resp = client.post("/api/v1/projects", json=project_payload, headers=auth_headers)
    assert resp.status_code == 201
    created_id = resp.json()["id"]

    # Public get by slug works
    resp = client.get("/api/v1/projects/portfolio-website")
    assert resp.status_code == 200
    assert resp.json()["title"] == "Portfolio Website"
    assert "FastAPI" in resp.json()["tech_stack"]

    # Featured list returns it
    resp = client.get("/api/v1/projects/featured")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # Admin delete succeeds
    resp = client.delete(f"/api/v1/projects/{created_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_public_contact_submission_and_admin_view(client: TestClient, auth_headers: dict[str, str]) -> None:
    # Anyone can submit a message
    contact_data = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "subject": "Collaboration Inquiry",
        "message": "Hi, I would love to discuss a project with you!",
    }
    resp = client.post("/api/v1/contact", json=contact_data)
    assert resp.status_code == 201
    message_id = resp.json()["id"]

    # Public cannot read messages
    resp = client.get("/api/v1/contact")
    assert resp.status_code == 401 or resp.status_code == 403

    # Admin can list messages
    resp = client.get("/api/v1/contact", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # Admin can check unread count
    resp = client.get("/api/v1/contact/unread/count", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["unread"] == 1

    # Admin can mark as read
    resp = client.patch(f"/api/v1/contact/{message_id}", json={"read": True}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["read"] is True


def test_skills_crud(client: TestClient, auth_headers: dict[str, str]) -> None:
    # Public list
    resp = client.get("/api/v1/skills")
    assert resp.status_code == 200
    assert resp.json() == []

    # Admin create skill
    skill_data = {
        "name": "Python",
        "category": "Backend",
        "display_order": 1,
    }
    resp = client.post("/api/v1/skills", json=skill_data, headers=auth_headers)
    assert resp.status_code == 201
    skill_id = resp.json()["id"]

    # Public filter by category
    resp = client.get("/api/v1/skills/category/Backend")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["name"] == "Python"

    # Admin delete skill
    resp = client.delete(f"/api/v1/skills/{skill_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_skill_category_card_management(client: TestClient, auth_headers: dict[str, str]) -> None:
    # 1. Create two skills under a custom category card "Mobile Development"
    s1 = client.post(
        "/api/v1/skills",
        json={"name": "Flutter", "category": "Mobile Development", "display_order": 1},
        headers=auth_headers,
    )
    assert s1.status_code == 201

    s2 = client.post(
        "/api/v1/skills",
        json={"name": "React Native", "category": "Mobile Development", "display_order": 2},
        headers=auth_headers,
    )
    assert s2.status_code == 201

    # Verify category filter
    resp = client.get("/api/v1/skills/category/Mobile Development")
    assert resp.status_code == 200
    assert len(resp.json()) == 2

    # 2. Rename category card from "Mobile Development" to "Mobile & Embedded"
    rename_resp = client.patch(
        "/api/v1/skills/category/Mobile Development/rename",
        json={"new_name": "Mobile & Embedded"},
        headers=auth_headers,
    )
    assert rename_resp.status_code == 200
    assert rename_resp.json()["renamed"] == 2

    # Old category now empty, new category has 2 skills
    assert len(client.get("/api/v1/skills/category/Mobile Development").json()) == 0
    assert len(client.get("/api/v1/skills/category/Mobile & Embedded").json()) == 2

    # 3. Delete entire category card
    del_resp = client.delete(
        "/api/v1/skills/category/Mobile & Embedded",
        headers=auth_headers,
    )
    assert del_resp.status_code == 200
    assert del_resp.json()["deleted"] == 2

    # Verify both skills deleted
    assert len(client.get("/api/v1/skills/category/Mobile & Embedded").json()) == 0


def test_cv_upload_download_and_deletion(client: TestClient, auth_headers: dict[str, str]) -> None:
    # 1. Initially no CV uploaded
    resp = client.get("/api/v1/profile/cv")
    assert resp.status_code == 404

    # 2. Unauthenticated upload rejected
    dummy_pdf = b"%PDF-1.4\n%Fake PDF content for test\n%%EOF"
    files = {"file": ("test_cv.pdf", dummy_pdf, "application/pdf")}
    resp = client.post("/api/v1/profile/cv/upload", files=files)
    assert resp.status_code in (401, 403)

    # 3. Non-PDF file rejected
    fake_txt = b"Hello, this is plain text"
    resp = client.post(
        "/api/v1/profile/cv/upload",
        files={"file": ("notes.txt", fake_txt, "text/plain")},
        headers=auth_headers,
    )
    assert resp.status_code == 400

    # 4. Valid PDF upload succeeds
    files = {"file": ("Demilew_Terefe_CV.pdf", dummy_pdf, "application/pdf")}
    upload_resp = client.post("/api/v1/profile/cv/upload", files=files, headers=auth_headers)
    assert upload_resp.status_code == 201
    media_data = upload_resp.json()
    assert media_data["filename"] == "Demilew_Terefe_CV.pdf"
    assert media_data["mime_type"] == "application/pdf"

    # 5. Public metadata endpoint returns CV information
    meta_resp = client.get("/api/v1/profile/cv")
    assert meta_resp.status_code == 200
    cv_info = meta_resp.json()
    assert cv_info["filename"] == "Demilew_Terefe_CV.pdf"
    assert "/api/v1/profile/cv/download" in cv_info["url"]

    # 6. Public download / view streams PDF
    dl_resp = client.get("/api/v1/profile/cv/download")
    assert dl_resp.status_code == 200
    assert dl_resp.headers["content-type"] == "application/pdf"
    assert b"%PDF-1.4" in dl_resp.content

    # 7. Unauthenticated delete rejected
    del_unauth = client.delete("/api/v1/profile/cv")
    assert del_unauth.status_code in (401, 403)

    # 8. Authenticated delete succeeds
    del_resp = client.delete("/api/v1/profile/cv", headers=auth_headers)
    assert del_resp.status_code == 204

    # 9. Verifying CV is now gone
    assert client.get("/api/v1/profile/cv").status_code == 404

