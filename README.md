# EduCore — School Management System

A full-stack school management system built with **FastAPI** and **React**. Manage students, teachers, classes, attendance, exams, marks, fees, and timetables from a single premium dashboard.

![Dashboard](assets/pop_01_dashboard.png)

---

## Features

**Admin**
- Dashboard with live KPIs (students, teachers, fee collection, attendance rate)
- Manage students, teachers, classes, sections, and subjects
- Schedule exams and record marks with automatic grade calculation
- Track fee payments (tuition, transport, library, exam fees)
- Attendance overview and reports & analytics

**Teacher**
- View assigned classes and subjects
- Mark student attendance
- Upload exam marks

**Student**
- Personal dashboard with attendance summary
- View results and grade reports
- Check fee status and timetable

---

## Tech Stack

### Backend
| Package | Version |
|---|---|
| FastAPI | 0.115.5 |
| SQLAlchemy | 2.0.36 |
| Alembic | 1.14.0 |
| PostgreSQL (psycopg2) | 2.9.10 |
| python-jose (JWT) | 3.3.0 |
| passlib + bcrypt | 1.7.4 |
| Pydantic v2 | 2.10.3 |
| Uvicorn | 0.32.1 |

### Frontend
| Package | Version |
|---|---|
| React | 18.3 |
| Vite | 6.x |
| Tailwind CSS | 3.x |
| Radix UI (shadcn/ui) | various |
| TanStack Query | 5.x |
| Framer Motion | 11.x |
| Recharts | 2.x |
| Zustand | 5.x |
| React Router | 6.x |
| Axios | 1.x |

---

## Project Structure

```
School-Management/
├── app/
│   ├── auth/          # JWT, password hashing, route guards
│   ├── config/        # Pydantic settings (.env loader)
│   ├── database/      # SQLAlchemy engine & session
│   ├── models/        # SQLAlchemy ORM models
│   ├── routers/       # FastAPI route handlers (10 modules)
│   ├── schemas/       # Pydantic request/response schemas
│   ├── services/      # Business logic layer
│   └── main.py        # App entry point, CORS, router registration
├── alembic/           # Database migrations
├── frontend/
│   └── src/
│       ├── components/    # Shared UI components + shadcn/ui primitives
│       ├── layouts/       # AppSidebar, DashboardLayout, AuthLayout
│       ├── pages/         # admin / teacher / student page views
│       ├── routes/        # createBrowserRouter + ProtectedRoute
│       ├── services/      # Axios API service layer
│       ├── store/         # Zustand stores (auth, UI theme)
│       ├── styles/        # Global CSS variables (dark/light mode)
│       └── types/         # TypeScript interfaces
├── requirements.txt
└── .env.example
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repo

```bash
git clone https://github.com/MohammadNazim01/School-Management.git
cd School-Management
```

### 2. Backend setup

```bash
# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Database setup

```bash
# Create the database (run in psql or pgAdmin)
CREATE DATABASE school_management;

# Run migrations
alembic upgrade head
```

### 4. Start the backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API docs available at `http://localhost:8000/docs`

### 5. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:3000`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/school_management
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@school.edu | admin123 |
| Teacher | teacher@school.edu | teacher123 |
| Student | student@school.edu | student123 |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Login, returns JWT |
| GET | `/api/v1/auth/me` | Current user profile |
| GET/POST | `/api/v1/students` | List / create students |
| GET/POST | `/api/v1/teachers` | List / create teachers |
| GET/POST | `/api/v1/classes` | List / create classes |
| GET/POST | `/api/v1/subjects` | List / create subjects |
| GET/POST | `/api/v1/exams` | List / schedule exams |
| GET/POST | `/api/v1/marks` | Get / upload marks |
| GET/POST | `/api/v1/attendance` | Get / mark attendance |
| GET/POST | `/api/v1/fees` | List / record fees |
| GET/POST | `/api/v1/timetable` | List / create timetable entries |

Full interactive docs at `http://localhost:8000/docs`

---

## Screenshots

| Dashboard | Students |
|---|---|
| ![Dashboard](assets/pop_01_dashboard.png) | ![Students](assets/pop_02_students.png) |

| Teachers | Exams |
|---|---|
| ![Teachers](assets/pop_03_teachers.png) | ![Exams](assets/pop_06_exams.png) |

---

## License

MIT
