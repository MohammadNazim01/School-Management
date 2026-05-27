# EduCore — School Management System

A full-stack monorepo school management system. Premium SaaS-style UI backed by a production-ready FastAPI REST API.

---

## Repository Structure

```
School-Management/
├── backend/                  # FastAPI + PostgreSQL API
│   ├── app/
│   │   ├── auth/             # JWT, password hashing, route guards
│   │   ├── config/           # Pydantic settings (.env loader)
│   │   ├── database/         # SQLAlchemy engine & session
│   │   ├── models/           # ORM models — 10 tables
│   │   ├── routers/          # Route handlers — 10 modules
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic layer
│   │   └── main.py           # App factory, CORS, router registration
│   ├── alembic/              # Database migrations
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── run.py                # Dev server entry point
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                 # React + Vite dashboard
│   ├── src/
│   │   ├── components/       # Shared UI + shadcn/ui primitives
│   │   ├── layouts/          # Sidebar, Navbar, AuthLayout
│   │   ├── pages/            # Admin, Teacher, Student views
│   │   ├── routes/           # Router + ProtectedRoute
│   │   ├── services/         # Axios API service layer
│   │   ├── store/            # Zustand (auth + UI theme)
│   │   ├── styles/           # CSS variables (dark/light mode)
│   │   └── types/            # TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml        # One-command full-stack startup
├── .gitignore
└── README.md
```

---

## Quick Start

### Option 1 — Docker (recommended)

```bash
# Copy and fill backend env
cp backend/.env.example backend/.env

# Start everything (PostgreSQL + backend + frontend)
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

### Option 2 — Local development

**Prerequisites:** Python 3.11+, Node.js 18+, PostgreSQL 14+

#### Backend

```bash
cd backend

python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # fill in your DB credentials

alembic upgrade head   # run migrations
python run.py          # starts on http://localhost:8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:3000
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@school.edu | admin123 |
| Teacher | teacher@school.edu | teacher123 |
| Student | student@school.edu | student123 |

---

## Features

| Module | Admin | Teacher | Student |
|---|:---:|:---:|:---:|
| Dashboard (KPIs + charts) | ✓ | ✓ | ✓ |
| Students CRUD | ✓ | — | — |
| Teachers CRUD | ✓ | — | — |
| Classes & Sections | ✓ | — | — |
| Subjects management | ✓ | — | — |
| Attendance — mark | ✓ | ✓ | — |
| Attendance — view own | — | — | ✓ |
| Exams scheduling | ✓ | — | — |
| Marks upload | ✓ | ✓ | — |
| Results / grades | ✓ | ✓ | ✓ |
| Fee management | ✓ | — | ✓ |
| Timetable | ✓ | ✓ | ✓ |
| Reports & analytics | ✓ | — | — |

---

## Tech Stack

**Backend** — FastAPI · SQLAlchemy 2.0 · Alembic · PostgreSQL · python-jose · passlib · Pydantic v2

**Frontend** — React 18 · Vite · TypeScript · Tailwind CSS · Radix UI · TanStack Query · Zustand · Framer Motion · Recharts

---

## Sub-project READMEs

- [`backend/README.md`](backend/README.md) — API setup, endpoints, roles
- [`frontend/README.md`](frontend/README.md) — UI setup, design notes, env
