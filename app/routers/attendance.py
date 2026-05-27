from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_teacher_or_admin
from app.database.connection import get_db
from app.models.teacher import Teacher
from app.models.user import User, UserRole
from app.schemas.attendance import (
    AttendanceCreate, AttendanceResponse, AttendanceSummary, AttendanceUpdate,
)
from app.services import attendance as attendance_service

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def _get_teacher_id(current_user: User, db: Session) -> UUID:
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Teacher profile not found for this user")
    return teacher.id


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    data: AttendanceCreate,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
):
    teacher_id = _get_teacher_id(current_user, db)
    return attendance_service.mark_attendance(data, teacher_id, db)


@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    attendance_id: UUID,
    data: AttendanceUpdate,
    current_user: User = Depends(require_teacher_or_admin),
    db: Session = Depends(get_db),
):
    return attendance_service.update_attendance(attendance_id, data, db)


@router.get("/students/{student_id}", response_model=list[AttendanceResponse])
def get_student_attendance(
    student_id: UUID,
    from_date: date | None = Query(None),
    to_date: date | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return attendance_service.get_student_attendance(student_id, db, from_date, to_date)


@router.get("/students/{student_id}/summary", response_model=AttendanceSummary)
def get_attendance_summary(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return attendance_service.get_attendance_summary(student_id, db)
