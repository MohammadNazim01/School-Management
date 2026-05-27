from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.teacher import Teacher
from app.schemas.attendance import AttendanceCreate, AttendanceSummary, AttendanceUpdate


def mark_attendance(data: AttendanceCreate, teacher_id: UUID, db: Session) -> Attendance:
    existing = db.query(Attendance).filter(
        Attendance.student_id == data.student_id,
        Attendance.date == data.date,
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Attendance already marked for this date")

    record = Attendance(
        student_id=data.student_id,
        marked_by_id=teacher_id,
        date=data.date,
        status=data.status,
        note=data.note,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_attendance_or_404(attendance_id: UUID, db: Session) -> Attendance:
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found")
    return record


def update_attendance(attendance_id: UUID, data: AttendanceUpdate, db: Session) -> Attendance:
    record = get_attendance_or_404(attendance_id, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


def get_student_attendance(
    student_id: UUID, db: Session, from_date: date | None = None, to_date: date | None = None
) -> list[Attendance]:
    q = db.query(Attendance).filter(Attendance.student_id == student_id)
    if from_date:
        q = q.filter(Attendance.date >= from_date)
    if to_date:
        q = q.filter(Attendance.date <= to_date)
    return q.order_by(Attendance.date).all()


def get_attendance_summary(student_id: UUID, db: Session) -> AttendanceSummary:
    records = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    total = len(records)
    present = sum(1 for r in records if r.status == AttendanceStatus.PRESENT)
    absent = sum(1 for r in records if r.status == AttendanceStatus.ABSENT)
    late = sum(1 for r in records if r.status == AttendanceStatus.LATE)
    percentage = round((present / total * 100), 2) if total > 0 else 0.0
    return AttendanceSummary(
        student_id=student_id,
        total_days=total,
        present=present,
        absent=absent,
        late=late,
        attendance_percentage=percentage,
    )
