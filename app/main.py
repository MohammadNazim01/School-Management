from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, attendance, classes, exams, fees, marks, students, subjects, teachers, timetable

app = FastAPI(
    title="School Management System",
    description="A production-ready School Management API built with FastAPI and PostgreSQL",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(students.router, prefix=API_PREFIX)
app.include_router(teachers.router, prefix=API_PREFIX)
app.include_router(classes.router, prefix=API_PREFIX)
app.include_router(subjects.router, prefix=API_PREFIX)
app.include_router(attendance.router, prefix=API_PREFIX)
app.include_router(exams.router, prefix=API_PREFIX)
app.include_router(marks.router, prefix=API_PREFIX)
app.include_router(fees.router, prefix=API_PREFIX)
app.include_router(timetable.router, prefix=API_PREFIX)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "School Management System API"}
