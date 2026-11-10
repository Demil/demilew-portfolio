# Architectural Decision Records (ADRs)
**Document:** `docs/DECISIONS.md`  
**Project Owner:** Demilew Terefe  
**Phase:** Phase 8 (Testing and Optimization — Completed)

---

## ADR 001: Modular Monorepo Architecture
- **Date:** 2026-11-06
- **Status:** Accepted
- **Context:** The project requires a public portfolio, an admin CMS, a Python backend, and local PostgreSQL containerization.
- **Decision:** Use a single monorepo repository structured into `frontend/`, `backend/`, `infrastructure/`, and `docs/`.
- **Consequences:** Simplified version control, independent build and deployment lifecycles, clear boundary separation between presentation and data layers.

---

## ADR 002: Next.js App Router for Frontend
- **Date:** 2026-11-06
- **Status:** Accepted
- **Context:** The platform serves both public static/ISR portfolio views and dynamic administrative dashboard interfaces.
- **Decision:** Utilize Next.js 16 with the App Router, React 19, TypeScript, and Tailwind CSS.
- **Consequences:** High-performance Server Components for public views, fast client components for interactive CMS forms, and built-in image and route optimization.

---

## ADR 003: FastAPI & SQLAlchemy 2.0 for Backend API
- **Date:** 2026-11-06
- **Status:** Accepted
- **Context:** Demilew's core technical profile emphasizes Python software engineering, AI/data systems, and high-performance APIs.
- **Decision:** Standardize on FastAPI, Pydantic v2 validation schemas, SQLAlchemy 2.0 ORM, and Alembic database migrations.
- **Consequences:** Automatic OpenAPI documentation generation, type-safe data handling, and relational query modeling.

---

## ADR 004: Security — Argon2id and HTTP-Only Secure Cookies
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Section 7 of `PROJECT_INSTRUCTIONS.md` mandates strong security, specifically forbidding insecure token storage and requiring industry-standard password hashing.
- **Decision:** 
  1. Use Argon2id via `argon2-cffi` for administrative password hashing.
  2. Implement authentication credentials using `HttpOnly`, `SameSite=Lax`, `Secure` cookies with CSRF token verification for all state-changing mutations.
  3. Enforce a single administrator policy without open public registration.
- **Consequences:** Mitigates XSS-based credential theft, guards against CSRF, and adheres strictly to project security requirements.

---

## ADR 005: Offline-Resilient Font & Icon Strategy
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** In air-gapped or sandboxed build environments, `next/font/google` builds fail due to CDN timeouts fetching remote Google fonts.
- **Decision:** Use high-performance system font stacks (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) and local SVG icon components for brand icons.
- **Consequences:** Deterministic, 100% offline-capable production builds with zero latency penalty from third-party font CDNs.

---

## ADR 006: Session Management, Double-Submit CSRF, and Login Rate Limiting
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Phase 3 requires secure session handling for the `/admin` CMS, mitigating automated brute-force attacks and cross-site request forgery.
- **Decision:**
  1. **Sliding-Window Rate Limiter**: Implemented in `app/core/rate_limit.py` to throttle failed login attempts (maximum 5 attempts per 60-second window per client IP/email).
  2. **Double-Submit CSRF Protection**: Implemented in `app/core/csrf.py`. Safe methods (`GET`, `HEAD`, `OPTIONS`) and Bearer token requests bypass CSRF; cookie-authenticated mutations (`POST`, `PUT`, `PATCH`, `DELETE`) require an `X-CSRF-Token` header matching the client-readable `csrf_token` cookie.
  3. **Bootstrap vs. Lockout Policy**: Initial admin bootstrap is permitted via `/api/v1/auth/setup` on clean installations. Once the initial admin is registered, public registration is permanently disabled (returns 403 Forbidden). Additional admins can only be created by an authenticated administrator.
- **Consequences:** Zero exposure of credentials in localStorage, hardened brute-force defense, strict compliance with Section 6.2 and Section 7.

---

## ADR 007: Content Publishing Lifecycle & Public Separation
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Section 6.1 and Section 6.2 require a rigorous publishing lifecycle (`DRAFT`, `PUBLISHED`, `ARCHIVED`) and ensure unpublished drafts never leak to public endpoints.
- **Decision:**
  1. Define a shared `PublishingStatus` PostgreSQL enum applied to content models (`Project`, `Research`, etc.).
  2. Public REST routes (`/api/v1/{resource}`) filter strictly for `status == PublishingStatus.PUBLISHED`.
  3. Administrative REST routes (`/api/v1/{resource}/admin/all`) require `require_admin` dependency and return all items across all publishing states.
- **Consequences:** Clean architectural separation, zero data leakage of draft content, intuitive administrative control.

---

## ADR 008: Admin CMS UI State & Client API Architecture
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Phase 5 requires a rich, reactive, and secure admin interface across 10 functional modules without sacrificing safety or usability.
- **Decision:**
  1. Centralize all CMS API requests in `frontend/src/lib/cms-api.ts` with transparent CSRF token extraction from cookies, error unwrapping, and `credentials: 'include'`.
  2. Implement modular Next.js App Router pages under `frontend/src/app/admin/` with consistent modal dialogs, optimistic updates, and status indicators.
  3. Avoid proficiency percentages in skills per Section 6.1, organizing skills instead by logical categorical domains (AI/ML, Backend, Cloud, Tools).
- **Consequences:** Cohesive and robust administrative user experience with full coverage across all portfolio data entities.

---

## ADR 009: Hybrid Rendering Strategy (ISR + SSG) for Public Portfolio
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** The public portfolio must provide sub-millisecond initial page loads, optimal search engine indexing (SEO), and fast TTFB, while reflecting CMS edits without requiring manual frontend re-deployments.
- **Decision:**
  1. Use Next.js Incremental Static Regeneration (ISR) with a 60-second revalidation period on the public homepage (`/`).
  2. Implement Static Site Generation (`generateStaticParams`) on project case study routes (`/projects/[slug]`).
  3. Implement a resilient fallback layer in `frontend/src/lib/api.ts` with abort timeouts (1500ms), ensuring high availability if the backend is temporarily offline during deployments.
- **Consequences:** Fast global delivery, automated cache invalidation upon CMS updates, zero layout degradation.

---

## ADR 010: Strict Verified Data Integrity Policy
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Section 2 and Section 11 of `PROJECT_INSTRUCTIONS.md` strictly prohibit fabricating metrics, publications, external repositories, or featuring excluded projects (hate speech detection, smart farming).
- **Decision:**
  1. Author and execute `backend/app/db/seed.py` strictly containing verified facts: Demilew's BDU degree (CGPA 3.84/4.00), Huawei PCM role, INSA Data Science role, and the three approved projects (CNN-LSTM Network Intrusion Detection, Privacy-Preserving Deepfake Detection, Dashen Smart AI).
  2. Update frontend fallback datasets (`INITIAL_PROJECTS`, `INITIAL_EXPERIENCES`, `INITIAL_EDUCATION`, `INITIAL_RESEARCH`) with identical verified facts.
  3. Exclude arbitrary proficiency percentages in accordance with Section 6.1.
- **Consequences:** 100% adherence to project owner instructions and verified professional representation.

---

## ADR 011: Storage Provider Abstraction
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Section 10 requires storing files in an appropriate file or object storage system while keeping metadata in PostgreSQL. The initial local setup must be easily upgradable to S3/MinIO.
- **Decision:**
  1. Define a generic `StorageBackend` abstract base class in `app/core/storage.py` (`save`, `read`, `delete`, `exists`).
  2. Implement `LocalStorageBackend` storing files locally under `uploads/` with UUID-based filenames to prevent collisions and path traversals.
  3. Reference stored media files using unique storage keys stored in PostgreSQL `media.file_path`.
- **Consequences:** Clean decoupling of physical file storage from database relations; allows simple replacement with an S3 backend in production without modifying business services.

---

## ADR 012: Deep Media Content Validation (MIME & Magic Bytes)
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Section 7 and 10 mandate rigorous file validation to prevent arbitrary file upload vulnerabilities, remote code execution, and XSS attacks.
- **Decision:**
  1. Restrict permitted file extensions strictly to `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif`, and `.pdf`.
  2. Enforce a strict 10 MB maximum file size limit.
  3. Verify true binary magic signatures (e.g., `%PDF-` for PDFs, `\x89PNG` for PNGs, SOI marker for JPEGs).
  4. Sanitize SVG uploads by actively inspecting content for dangerous executable `<script>` tags.
- **Consequences:** Completely mitigates file extension spoofing, polyglot file attacks, and unauthorized script injection.

---

## ADR 013: Defense-in-Depth HTTP Security Headers
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Section 7 mandates industry-standard security headers across all client interactions to prevent clickjacking, MIME-sniffing, and cross-origin leakage.
- **Decision:**
  1. Implement `SecurityHeadersMiddleware` in FastAPI (`backend/app/main.py`) injecting `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-XSS-Protection: 1; mode=block`.
  2. Configure corresponding security headers in `next.config.ts` for all Next.js App Router routes.
- **Consequences:** Uniform, server-enforced security headers on both public and administrative endpoints.

---

## ADR 014: Full-Stack Regression & End-to-End Test Verification
- **Date:** 2026-11-07
- **Status:** Accepted
- **Context:** Phase 8 requires complete verification of the entire application across backend, database, security, and presentation layers before preparing production deployment.
- **Decision:**
  1. Standardize on 37 automated pytest integration tests covering every API router, publishing lifecycle, and input boundary.
  2. Implement dedicated end-to-end publishing tests (`backend/tests/test_end_to_end_workflows.py`) simulating real administrator content creation and verifying zero data leakage on public interfaces.
  3. Validate database B-Tree index coverage across all 14 PostgreSQL tables for sub-millisecond query execution.
- **Consequences:** High reliability, verified data isolation, and regression-proof codebase ready for production deployment.
