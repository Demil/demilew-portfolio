"""Phase 7 Media Management Integration Tests.

Validates secure file uploads, MIME & magic bytes validation,
file size constraints, metadata CRUD, streaming, and access control.
"""

import io
from fastapi.testclient import TestClient


def test_media_upload_requires_admin(client: TestClient) -> None:
    # 1. Unauthenticated upload rejected
    png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
    files = {"file": ("test.png", io.BytesIO(png_bytes), "image/png")}
    resp = client.post("/api/v1/media/upload", files=files)
    assert resp.status_code in (401, 403)


def test_media_upload_image_and_metadata(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    # Valid PNG with magic bytes
    png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    files = {"file": ("avatar.png", io.BytesIO(png_bytes), "image/png")}
    data = {"alt_text": "Demilew Profile Picture"}

    resp = client.post(
        "/api/v1/media/upload",
        files=files,
        data=data,
        headers=auth_headers,
    )
    assert resp.status_code == 201
    media = resp.json()
    assert media["id"] is not None
    assert media["filename"] == "avatar.png"
    assert media["mime_type"] == "image/png"
    assert media["alt_text"] == "Demilew Profile Picture"
    assert media["file_size_bytes"] == len(png_bytes)
    assert "/api/v1/media/files/" in media["url"]

    media_id = media["id"]
    storage_filename = media["file_path"]

    # 2. Public metadata read
    meta_resp = client.get(f"/api/v1/media/{media_id}")
    assert meta_resp.status_code == 200
    assert meta_resp.json()["filename"] == "avatar.png"

    # 3. Public file stream by filename
    file_resp = client.get(f"/api/v1/media/files/{storage_filename}")
    assert file_resp.status_code == 200
    assert file_resp.content == png_bytes
    assert file_resp.headers["content-type"].startswith("image/png")

    # 4. Public file download by ID
    down_resp = client.get(f"/api/v1/media/{media_id}/download")
    assert down_resp.status_code == 200
    assert down_resp.content == png_bytes
    assert 'filename="avatar.png"' in down_resp.headers["content-disposition"]


def test_media_upload_pdf_document(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    # Valid PDF with %PDF- header
    pdf_bytes = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n"
    files = {"file": ("Demilew_CV.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    data = {"alt_text": "Demilew Terefe Curriculum Vitae"}

    resp = client.post(
        "/api/v1/media/upload",
        files=files,
        data=data,
        headers=auth_headers,
    )
    assert resp.status_code == 201
    media = resp.json()
    assert media["filename"] == "Demilew_CV.pdf"
    assert media["mime_type"] == "application/pdf"

    # Verify download serves with application/pdf
    down_resp = client.get(f"/api/v1/media/{media['id']}/download")
    assert down_resp.status_code == 200
    assert down_resp.headers["content-type"].startswith("application/pdf")
    assert down_resp.content == pdf_bytes


def test_media_validation_rejects_disallowed_extensions(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    # Disallowed executable script
    sh_bytes = b"#!/bin/bash\necho 'forbidden'\n"
    files = {"file": ("exploit.sh", io.BytesIO(sh_bytes), "text/x-shellscript")}

    resp = client.post(
        "/api/v1/media/upload",
        files=files,
        headers=auth_headers,
    )
    assert resp.status_code == 400
    assert "not permitted" in resp.json()["detail"].lower()


def test_media_validation_rejects_mime_or_magic_mismatch(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    # Declared PNG but invalid random text bytes
    fake_png = b"This is plainly plain text, not a valid PNG binary."
    files = {"file": ("fake.png", io.BytesIO(fake_png), "image/png")}

    resp = client.post(
        "/api/v1/media/upload",
        files=files,
        headers=auth_headers,
    )
    assert resp.status_code == 400
    assert "magic" in resp.json()["detail"].lower() or "signature" in resp.json()["detail"].lower()


def test_media_validation_rejects_empty_file(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    files = {"file": ("empty.png", io.BytesIO(b""), "image/png")}

    resp = client.post(
        "/api/v1/media/upload",
        files=files,
        headers=auth_headers,
    )
    assert resp.status_code == 400
    assert "empty" in resp.json()["detail"].lower()


def test_media_update_alt_text_and_listing(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    files = {"file": ("diagram.png", io.BytesIO(png_bytes), "image/png")}

    upload_resp = client.post("/api/v1/media/upload", files=files, headers=auth_headers)
    assert upload_resp.status_code == 201
    media_id = upload_resp.json()["id"]

    # List media
    list_resp = client.get("/api/v1/media", headers=auth_headers)
    assert list_resp.status_code == 200
    data = list_resp.json()
    assert data["total"] >= 1
    assert any(m["id"] == media_id for m in data["items"])

    # Update alt text
    patch_resp = client.patch(
        f"/api/v1/media/{media_id}",
        json={"alt_text": "Updated CNN-LSTM Architecture Diagram"},
        headers=auth_headers,
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["alt_text"] == "Updated CNN-LSTM Architecture Diagram"


def test_media_delete_lifecycle(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    jpeg_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00"
    files = {"file": ("photo.jpg", io.BytesIO(jpeg_bytes), "image/jpeg")}

    upload_resp = client.post("/api/v1/media/upload", files=files, headers=auth_headers)
    assert upload_resp.status_code == 201
    media_id = upload_resp.json()["id"]
    filename = upload_resp.json()["file_path"]

    # Delete media
    del_resp = client.delete(f"/api/v1/media/{media_id}", headers=auth_headers)
    assert del_resp.status_code == 204

    # Subsequent fetch should be 404
    get_resp = client.get(f"/api/v1/media/{media_id}")
    assert get_resp.status_code == 404

    # Direct file access should be 404
    file_resp = client.get(f"/api/v1/media/files/{filename}")
    assert file_resp.status_code == 404

