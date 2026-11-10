# Demilew Portfolio Platform

**Project Owner:** Demilew Terefe  
**Architecture:** Modular Monorepo (Next.js 16 + FastAPI + PostgreSQL 16)  
**Specification:** `PROJECT_INSTRUCTIONS.md`  

---

## Workspace Structure

- `frontend/`: Next.js 16 (React 19, TypeScript, Tailwind CSS v4) App Router frontend.
- `backend/`: Python 3.11 FastAPI backend, Pydantic validation, SQLAlchemy 2.0 ORM, and Alembic migrations.
- `infrastructure/`: Local PostgreSQL 16 Docker Compose service with persistent storage.
- `docs/`: Comprehensive architecture, database, API, development, and decision records.

---

## Quickstart

### 1. Environment Configuration
```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
```

### 2. Database Service
```powershell
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose.yml up -d
```

### 3. Backend API
```powershell
.\backend\.venv\Scripts\Activate.ps1
uvicorn app.main:app --app-dir backend --reload --port 8000
```
API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Frontend Application
```powershell
cd frontend
npm install
npm run dev
```
Web Application: [http://localhost:3000](http://localhost:3000)

---

## Testing & Validation

- **Backend Tests:**
  ```powershell
  backend\.venv\Scripts\python.exe -m pytest backend/tests/ -v
  ```
- **Frontend Typecheck & Build:**
  ```powershell
  cd frontend
  .\node_modules\.bin\tsc.cmd --noEmit
  npm run build
  ```

---

## Documentation Suite

- [`PROJECT_INSTRUCTIONS.md`](file:///d:/My%20site/PROJECT_INSTRUCTIONS.md) — Permanent project requirements and specifications
- [`docs/ARCHITECTURE.md`](file:///d:/My%20site/docs/ARCHITECTURE.md) — System architecture and component boundaries
- [`docs/DATABASE.md`](file:///d:/My%20site/docs/DATABASE.md) — 12-entity relational database design and publishing lifecycle
- [`docs/API.md`](file:///d:/My%20site/docs/API.md) — REST API specifications and conventions
- [`docs/DEVELOPMENT.md`](file:///d:/My%20site/docs/DEVELOPMENT.md) — Step-by-step local development guide
- [`docs/DECISIONS.md`](file:///d:/My%20site/docs/DECISIONS.md) — Architectural Decision Records (ADRs)
