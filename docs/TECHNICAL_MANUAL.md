# Master Technical Documentation & Maintenance Manual

**Project**: Demilew Terefe Portfolio & Research Platform  
**Owner & Author**: Demilew Terefe  
**Architecture**: Monorepo (Next.js 16 + FastAPI + Neon Cloud PostgreSQL)  
**Last Updated**: November 2026  
**Status**: Production-Ready  

---

## Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Technology Stack](#2-technology-stack)
3. [Database Architecture & Data Models](#3-database-architecture--data-models)
4. [Backend API Specification](#4-backend-api-specification)
5. [Frontend Architecture & Motion System](#5-frontend-architecture--motion-system)
6. [Mobile & Cross-Device System](#6-mobile--cross-device-system)
7. [Security & Secrets Management](#7-security--secrets-management)
8. [Maintenance Playbook (Step-by-Step)](#8-maintenance-playbook-step-by-step)
9. [Deployment & Production Setup](#9-deployment--production-setup)

---

## 1. System Overview & Architecture

The application is structured as a decoupled monorepo comprising a high-performance **FastAPI (Python 3.11)** backend, a cloud-hosted **PostgreSQL (Neon Serverless)** database, and an interactive **Next.js 16 (React 19, TypeScript, Tailwind CSS v4)** frontend.

```mermaid
flowchart TD
    subgraph Clients ["Client Layer"]
        MobileClient["Mobile Visitors\n(iOS Safari / Android Chrome)"]
        DesktopClient["Desktop Visitors\n(Modern Browsers)"]
        AdminUser["Demilew (Admin)\n(/admin)"]
    end

    subgraph Frontend ["Next.js 16 App Router (Port 3000)"]
        SSR["Server-Side Rendering & ISR\n(revalidate = 60s)"]
        DesignSys["Tailwind v4 Motion &\nColor Engine (#17e39b)"]
        LangContext["Bilingual Engine\n(English & አማርኛ)"]
        CvModal["In-Site PDF CV Modal Viewer\n(Custom Event Pipeline)"]
    end

    subgraph Backend ["FastAPI Application (Port 8000)"]
        CORS["CORS Dynamic Regex\n(*.vercel.app, *.onrender.com)"]
        APIRouter["API v1 Endpoints\n(/api/v1/*)"]
        AuthModule["Argon2id & JWT Auth\n(HttpOnly Cookies)"]
        PDFHandler["CV Stream Handler\n(inline vs attachment)"]
    end

    subgraph Storage ["Cloud Infrastructure"]
        NeonDB[("Neon Cloud PostgreSQL\n(SSL Pooling / Alembic)")]
        LocalMedia["Local / Uploads Storage\n(Verified CV Document)"]
    end

    MobileClient -->|HTTPS / Touch| Frontend
    DesktopClient -->|HTTPS| Frontend
    AdminUser -->|JWT / Secure Cookies| Frontend

    Frontend -->|safeFetch / REST JSON| CORS
    CORS --> APIRouter
    APIRouter --> AuthModule
    APIRouter --> PDFHandler
    APIRouter -->|SQLAlchemy 2.0| NeonDB
    PDFHandler --> LocalMedia
```

---

## 2. Technology Stack

### Backend
- **Language**: Python 3.11+
- **Framework**: FastAPI (high-throughput asynchronous REST API)
- **ORM & Database**: SQLAlchemy 2.0 with `psycopg2-binary`
- **Database Engine**: Neon Serverless Cloud PostgreSQL (`postgresql://...sslmode=require`)
- **Database Migrations**: Alembic (`head: a1b2c3d4e5f6`)
- **Authentication**: JWT tokens + Argon2id password hashing + HTTP-only cookies
- **Testing**: Pytest (39 unit & integration tests, 100% passing)

### Frontend
- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript (strict type checking, 0 errors)
- **Styling**: Tailwind CSS v4 with `@theme inline` design variables
- **Brand Palette**: Mint Emerald (`#17e39b`), Dark Slate (`#090b10`), Ambient Radial Header Glow
- **Icons**: Lucide React + custom SVG icons (`LinkedinIcon`, `GithubIcon`)
- **Rendering Strategy**: Incremental Static Regeneration (ISR) with `export const revalidate = 60;`

---

## 3. Database Architecture & Data Models

The database models Demilew's academic records, professional experience, research dossiers, technical skills, and client inquiries.

```mermaid
erDiagram
    PROFILES ||--o{ SOCIAL_LINKS : has
    PROFILES ||--o| MEDIA : "avatar & cv"
    PROJECTS ||--o{ PROJECT_MEDIA : includes
    EXPERIENCES {
        int id PK
        string company
        string role
        date start_date
        date end_date
        bool is_current
        string description
    }
    EDUCATIONS {
        int id PK
        string institution
        string degree
        string field
        string cgpa
        date end_date
    }
    PROJECTS {
        int id PK
        string title
        string slug
        string description
        string problem_statement
        string tech_stack
        string github_url
        string live_url
        int display_order
    }
    RESEARCH {
        int id PK
        string title
        string description
        string methodology
        string publication_url
        int display_order
    }
    SKILLS {
        int id PK
        string name
        string category
        int proficiency_level
    }
    MESSAGES {
        int id PK
        string name
        string email
        string subject
        string message
        datetime created_at
    }
    SITE_SETTINGS {
        int id PK
        string site_title
        string contact_email
        string availability_status
    }
```

### Key Tables & Schema Notes
1. **`profiles`**: Stores full name (`Demilew Terefe`), headline, biography, email (`demilew05terefe@gmail.com`), and links to `cv_media_id`.
2. **`projects`**: Contains project slugs (`cnn-lstm-network-intrusion-detection`, `privacy-preserving-deepfake-detection`, `dashen-smart-ai`) with problem statements and architecture details.
3. **`research`**: Houses academic dossiers covering Zero-Day Intrusion Detection, Federated Learning with Differential Privacy, and Ethiopic NLP.
4. **`media`**: Tracks stored media assets with unique hash filenames.
5. **`messages`**: Captures visitor inquiries submitted through the contact desk.

---

## 4. Backend API Specification

All backend endpoints are prefixed with `/api/v1`.

### Public Endpoints
| Method | Endpoint | Description | Query Parameters / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System health check | — |
| `GET` | `/profile` | Demilew's profile, bio, headline, social links | — |
| `GET` | `/profile/cv` | CV metadata (filename, size, update date) | — |
| `GET` | `/profile/cv/download` | Serves verified CV PDF | `?download=1` (attachment), default (inline) |
| `GET` | `/projects` | List of public projects | — |
| `GET` | `/projects/{slug}` | Project case study details | — |
| `GET` | `/research` | Academic research initiatives | — |
| `GET` | `/skills` | Grouped technical competencies | — |
| `GET` | `/experience` | Chronological professional journey | — |
| `GET` | `/education` | Academic degree & distinctions | — |
| `POST` | `/contact` | Submit contact / collaboration inquiry | `{ name, email, subject, message }` |
| `GET` | `/settings` | Public site settings (availability status) | — |

### Admin Endpoints (Requires JWT Cookie Authentication)
- `POST /api/v1/auth/login`: Admin authentication.
- `POST /api/v1/auth/logout`: Invalidate session.
- `GET /api/v1/admin/messages`: Read visitor contact messages.
- `POST /api/v1/admin/media/upload`: Upload new CV or project screenshot.
- `PUT /api/v1/admin/projects/{id}`: Edit project details.

---

## 5. Frontend Architecture & Motion System

### Component Directory Tree
```
frontend/src/
├── app/
│   ├── layout.tsx         # Global fonts, metadata, Providers
│   ├── page.tsx           # Portfolio Home Page (ISR revalidate = 60)
│   ├── globals.css        # Tailwind v4, tokens, touch & hover media queries
│   └── projects/[slug]/   # Dedicated project case study pages
├── components/
│   ├── Navbar.tsx         # Responsive header, reading scrollspy, mobile drawer
│   ├── Hero.tsx           # Editorial intro, 2-tier mobile actions, dossier card
│   ├── ServicesSection.tsx# Services, swipeable filter pills, consultation event
│   ├── ProjectsSection.tsx# Projects, architecture previews, GitHub links
│   ├── ResearchSection.tsx# Research, expandable formulations & benchmark datasets
│   ├── SkillsSection.tsx  # Dynamic domain cards, skill count badges
│   ├── ExperienceSection.tsx # Dual timeline for Huawei & INSA, Bahir Dar Univ
│   ├── ContactSection.tsx # Contact desk, direct phone/email, iOS-safe form
│   ├── CvViewerModal.tsx  # In-site browser PDF viewer with fallback banner
│   ├── VisitorNavDock.tsx # Floating section tracker & quick-jump navigation
│   └── Footer.tsx         # Bilingual copyright stamp & social links
├── context/
│   ├── ThemeContext.tsx   # Dark / Light theme persistence (localStorage)
│   └── LanguageContext.tsx# English / Amharic state management
├── lib/
│   ├── api.ts             # Type-safe API client with 6s timeout & fallback
│   └── translations.ts    # Comprehensive EN/AM dictionary (ደምለው ተረፈ)
└── types/
    └── portfolio.ts       # Shared TypeScript data interfaces
```

### Design System & Theme Engine
The brand uses a primary **Mint Emerald (`#17e39b`)** accent configured in `globals.css`:
- **Dark Mode**: High-contrast `#090b10` background with elevated card surfaces (`#111520`).
- **Light Mode**: Crisp `#f8fafc` background with `#059669` emerald tones.
- **Ambient Header Glow**: Subtle radial background gradient giving depth without performance cost.
- **Card Motion**: Subtle lift on hover (`translateY(-4px)`), scoped exclusively to devices with fine mouse pointers to avoid sticky states on touchscreens.

---

## 6. Mobile & Cross-Device System

The site implements specialized mobile architecture:

1. **Fluid Responsive Grid**: Content containers use `px-4 sm:px-6` to ensure maximum reading area on 360px–390px screens without side clipping.
2. **Horizontal Swipeable Filter Bars**: Category filters in Services, Projects, and Skills feature touch scrolling (`overflow-x-auto no-scrollbar`), letting users swipe smoothly through filters with one thumb.
3. **Full-Screen Mobile Drawer**: Mobile navigation locks background scrolling and includes backdrop dismissal.
4. **iOS Form Protection**: Form inputs use `text-base sm:text-sm` (16px on mobile) to eliminate iOS Safari's default auto-zoom behavior on tap.
5. **In-Site CV Viewer**: Embedded PDF modal features an assistive top banner (`Open Fullscreen ↗`) ensuring users on iOS or Android browsers that restrict iframe scrolling have a native fallback.

---

## 7. Security & Secrets Management

1. **Secrets Hygiene**:
   - Production secrets (`DATABASE_URL`, `JWT_SECRET_KEY`, `POSTGRES_PASSWORD`) are strictly isolated in `.env` files.
   - All `.env` files are ignored in `.gitignore`.
   - Never commit connection strings with raw credentials to version control.
2. **CORS Dynamic Regex**:
   - Configured in `backend/app/main.py` with `allow_origin_regex` to safely authorize arbitrary preview URLs from `https://.*\.vercel\.app` and `https://.*\.onrender\.com` while supporting credentials.
3. **Verified PDF Document**:
   - Demilew's authentic CV (`backend/uploads/5515cf4eb96f45cda5ad40e9f0fcc33a.pdf`) is explicitly whitelisted in `.gitignore` so deployment builds include the document.

---

## 8. Maintenance Playbook (Step-by-Step)

### A. How to Update Demilew's CV
1. Place the new PDF file in `d:\My site\backend\uploads\`.
2. Compute its SHA256 or unique filename (or retain the existing filename).
3. Update the media record in PostgreSQL or via the admin upload endpoint:
   ```powershell
   & "d:\My site\backend\.venv\Scripts\python.exe" -c "
   from app.core.database import SessionLocal
   from app.models.media import Media
   from app.models.profile import Profile
   import os

   db = SessionLocal()
   # Update filename and file size
   cv_media = db.query(Media).filter(Media.file_type == 'application/pdf').first()
   if cv_media:
       cv_media.original_filename = 'Demilew_Terefe_CV.pdf'
       db.commit()
       print('CV record updated successfully.')
   "
   ```
4. Verify the preview by opening `http://127.0.0.1:8000/api/v1/profile/cv/download` in your browser.

### B. How to Add a New Project
1. Open database or run a Python seed snippet:
   ```python
   new_project = Project(
       title="New AI Security Engine",
       slug="new-ai-security-engine",
       description="Brief summary of what was accomplished...",
       problem_statement="Why this problem matters...",
       tech_stack=["Python", "PyTorch", "FastAPI"],
       github_url="https://github.com/Demil/new-repo",
       is_published=True,
       display_order=4
   )
   db.add(new_project)
   db.commit()
   ```
2. Revalidate frontend: Next.js will automatically pick up the new project within 60 seconds (ISR).

### C. How to Change Contact Details
To update phone numbers or emails across the site:
1. Edit `frontend/src/lib/translations.ts` and `ContactSection.tsx`.
2. Update the profile record in the database:
   ```python
   p = db.query(Profile).first()
   p.email = "demilew05terefe@gmail.com"
   db.commit()
   ```

### D. Running Tests & Quality Checks
Before pushing any code to remote:
```powershell
# 1. Run Backend Pytest Suite (39 tests)
cd "d:\My site\backend"
.\.venv\Scripts\pytest -v

# 2. Run TypeScript Typecheck (0 errors)
cd "d:\My site\frontend"
npx tsc -p tsconfig.json --noEmit

# 3. Verify Production Build
npm run build
```

---

## 9. Deployment & Production Setup

### Step 1: Deploy Backend (Render or Railway)
1. Link your GitHub repository.
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables:
   - `DATABASE_URL`: `postgresql://neondb_owner:...@ep-icy-queen...neon.tech/demilew_db?sslmode=require`
   - `SECRET_KEY`: `<generated-random-32-char-key>`
   - `CORS_ORIGINS`: `https://demilew.vercel.app,https://*.vercel.app`

### Step 2: Deploy Frontend (Vercel)
1. Link the repository to [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**
3. Root Directory: `frontend`
4. Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://your-backend-app.onrender.com/api/v1`
5. Click **Deploy**. Vercel will build and serve your site globally on edge CDN.
