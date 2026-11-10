# API Specification
**Document:** `docs/API.md`  
**Project Owner:** Demilew Terefe  
**Phase Target:** Phase 3 (Authentication and Admin Foundation — Completed)

---

## 1. General Conventions

- **Base URL**: `/api/v1`
- **Protocol**: RESTful HTTP with JSON payloads
- **Status Codes**:
  - `200 OK`: Successful retrieval or synchronous update
  - `201 Created`: Resource successfully created
  - `204 No Content`: Successful deletion
  - `400 Bad Request`: Validation failure or malformed payload
  - `401 Unauthorized`: Authentication required or invalid session
  - `403 Forbidden`: Insufficient administrative privileges or CSRF failure
  - `404 Not Found`: Target entity not found
  - `409 Conflict`: Uniqueness constraint violation (e.g. duplicate slug/email)
  - `422 Unprocessable Entity`: Pydantic schema validation error
  - `429 Too Many Requests`: Login rate limiting triggered

---

## 2. Authentication & Authorization Flow (Phase 3)

### 2.1 Endpoints

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/auth/setup-status` | Public | Returns `{ "is_initialized": bool }` to guide client setup wizard |
| `POST` | `/api/v1/auth/setup` | Public (1st run) | Bootstrap initial administrator. Returns 403 once initialized |
| `POST` | `/api/v1/auth/login` | Public (Rate-limited) | Argon2id verification. Sets `access_token`, `refresh_token`, and `csrf_token` cookies |
| `POST` | `/api/v1/auth/refresh` | Cookie / Bearer | Rotates session tokens |
| `POST` | `/api/v1/auth/logout` | Cookie / Bearer | Clears session cookies |
| `GET` | `/api/v1/auth/me` | Admin | Returns currently authenticated `AdminUser` |
| `POST` | `/api/v1/auth/admin-users` | Admin | Creates secondary administrator (existing admin authorization required) |

### 2.2 Cookie & CSRF Specifications
- **`access_token`**: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=1800` (30 min).
- **`refresh_token`**: `HttpOnly`, `SameSite=Lax`, `Path=/api/v1/auth`, `Max-Age=604800` (7 days).
- **`csrf_token`**: `SameSite=Lax`, `Path=/`, `Max-Age=1800`.
- All cookie-authenticated mutations (`POST`, `PUT`, `PATCH`, `DELETE`) require the `X-CSRF-Token` header.

---

## 3. Core Resource Endpoints

| Resource | Method | Path | Access | Description |
|---|---|---|---|---|
| **Health** | `GET` | `/health`, `/api/v1/health` | Public | Application & database health status |
| **Profile** | `GET` | `/api/v1/profile` | Public | Returns published profile & social links |
| **Projects** | `GET` | `/api/v1/projects` | Public | List published projects |
| **Projects** | `GET` | `/api/v1/projects/{slug}` | Public | Project details by slug |
| **Projects** | `POST` | `/api/v1/projects` | Admin | Create project (Draft/Published) |
| **Projects** | `PATCH` | `/api/v1/projects/{id}` | Admin | Update project |
| **Projects** | `DELETE`| `/api/v1/projects/{id}` | Admin | Delete project |
| **Skills** | `GET` | `/api/v1/skills` | Public | List published skills |
| **Experience** | `GET`| `/api/v1/experience` | Public | List published work history |
| **Education** | `GET` | `/api/v1/education` | Public | List education milestones |
| **Research** | `GET` | `/api/v1/research` | Public | List research initiatives |
| **Certificates**| `GET`| `/api/v1/certificates`| Public | List certificates |
| **Contact** | `POST`| `/api/v1/contact` | Public | Submit contact message |
| **Contact** | `GET` | `/api/v1/contact` | Admin | List inbound inquiries |
| **Media** | `POST`| `/api/v1/media/upload`| Admin | Upload image or document |
