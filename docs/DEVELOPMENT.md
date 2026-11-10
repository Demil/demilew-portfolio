# Development Guide
**Document:** `docs/DEVELOPMENT.md`  
**Project Owner:** Demilew Terefe  
**Phase:** 1 (Project Foundation)

---

## 1. Prerequisites

- **Python 3.11** (`py -3.11`)
- **Node.js v20+** (v25 installed) and **npm**
- **Docker Desktop** (for PostgreSQL 16)

---

## 2. Environment Configuration

1. Copy the root environment template:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Copy backend environment template:
   ```powershell
   Copy-Item backend\.env.example backend\.env
   ```
3. Set a strong local password for `POSTGRES_PASSWORD` in `.env` and `backend/.env`.

---

## 3. Database Startup (Docker Compose)

Start the local PostgreSQL 16 service in the background:
```powershell
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose.yml up -d
```

Verify the database health check:
```powershell
docker compose -f infrastructure/docker-compose.yml ps
```

---

## 4. Backend Development (FastAPI)

1. Activate the Python virtual environment:
   ```powershell
   .\backend\.venv\Scripts\Activate.ps1
   ```
2. Run database migrations (when database phase is applied):
   ```powershell
   python -m alembic -c backend/alembic.ini upgrade head
   ```
3. Run the development API server:
   ```powershell
   uvicorn app.main:app --app-dir backend --reload --port 8000
   ```
4. Access API documentation:
   - Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc specification: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 5. Frontend Development (Next.js)

1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```
2. Run the Next.js development server:
   ```powershell
   npm run dev
   ```
3. Access the web application:
   - Public Website: [http://localhost:3000](http://localhost:3000)
   - Administrative CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 6. Testing

### Run Backend Tests
```powershell
cd "d:\My site"
backend\.venv\Scripts\python.exe -m pytest backend/tests/ -v
```

### Run Frontend Typecheck & Build
```powershell
cd "d:\My site\frontend"
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
```

