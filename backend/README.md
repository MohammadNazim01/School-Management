# EduCore — Backend

FastAPI + PostgreSQL REST API with JWT authentication and role-based access control.

## Tech Stack

- **FastAPI** 0.115 — async web framework
- **SQLAlchemy** 2.0 — ORM with mapped types
- **Alembic** — database migrations
- **PostgreSQL** — primary database
- **python-jose** — JWT token generation & validation
- **passlib + bcrypt** — password hashing
- **Pydantic v2** — request/response validation

## Project Layout

```
backend/
├── app/
│   ├── auth/           # JWT helpers, password utils, route guards
│   ├── config/         # Settings loaded from .env via pydantic-settings
│   ├── database/       # Engine, SessionLocal, DeclarativeBase
│   ├── middleware/      # Custom middleware stubs
│   ├── models/         # SQLAlchemy ORM models (10 tables)
│   ├── routers/        # FastAPI routers (one file per module)
│   ├── schemas/        # Pydantic request / response schemas
│   ├── services/       # Business logic layer
│   ├── utils/          # Shared helpers
│   └── main.py         # App factory, CORS, router registration
├── alembic/            # Migration scripts
├── alembic.ini         # Alembic configuration
├── requirements.txt
├── run.py              # Dev server entry point
├── .env.example        # Environment variable template
└── Dockerfile
```

## Setup

```bash
# 1. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 4. Run migrations
alembic upgrade head

# 5. Start the server
python run.py
# or
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API runs at **http://localhost:8000**
Interactive docs at **http://localhost:8000/docs**

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/school_management
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
```

## API Modules

| Prefix | Description |
|---|---|
| `/api/v1/auth` | Login, register, /me, change-password |
| `/api/v1/students` | CRUD for student records |
| `/api/v1/teachers` | CRUD for teacher records |
| `/api/v1/classes` | Classes and sections |
| `/api/v1/subjects` | Subjects with class and teacher assignment |
| `/api/v1/exams` | Schedule and manage exams |
| `/api/v1/marks` | Upload and retrieve exam marks |
| `/api/v1/attendance` | Mark and query attendance |
| `/api/v1/fees` | Fee records and payment status |
| `/api/v1/timetable` | Weekly timetable entries |

## Roles

| Role | Access |
|---|---|
| `admin` | Full access to all endpoints |
| `teacher` | Mark attendance, upload marks, view own classes |
| `student` | View own attendance, results, fees, timetable |
