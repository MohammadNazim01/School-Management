from datetime import datetime, time
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.timetable import DayOfWeek


class TimetableCreate(BaseModel):
    class_id: UUID
    section_id: UUID
    subject_id: UUID
    teacher_id: UUID
    day_of_week: DayOfWeek
    start_time: time
    end_time: time


class TimetableUpdate(BaseModel):
    subject_id: UUID | None = None
    teacher_id: UUID | None = None
    start_time: time | None = None
    end_time: time | None = None


class TimetableResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    class_id: UUID
    section_id: UUID
    subject_id: UUID
    teacher_id: UUID
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    created_at: datetime
