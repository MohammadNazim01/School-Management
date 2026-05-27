from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.attendance import AttendanceStatus


class AttendanceCreate(BaseModel):
    student_id: UUID
    date: date
    status: AttendanceStatus
    note: str | None = None


class AttendanceBulkCreate(BaseModel):
    date: date
    records: list[AttendanceCreate]


class AttendanceUpdate(BaseModel):
    status: AttendanceStatus | None = None
    note: str | None = None


class AttendanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    marked_by_id: UUID
    date: date
    status: AttendanceStatus
    note: str | None
    created_at: datetime


class AttendanceSummary(BaseModel):
    student_id: UUID
    total_days: int
    present: int
    absent: int
    late: int
    attendance_percentage: float
