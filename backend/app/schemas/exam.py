from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ExamCreate(BaseModel):
    name: str
    subject_id: UUID
    class_id: UUID
    exam_date: date
    total_marks: int
    pass_marks: int


class ExamUpdate(BaseModel):
    name: str | None = None
    exam_date: date | None = None
    total_marks: int | None = None
    pass_marks: int | None = None


class ExamResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    subject_id: UUID
    class_id: UUID
    exam_date: date
    total_marks: int
    pass_marks: int
    created_at: datetime
