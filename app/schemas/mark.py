from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MarkCreate(BaseModel):
    student_id: UUID
    exam_id: UUID
    marks_obtained: int


class MarkUpdate(BaseModel):
    marks_obtained: int | None = None


class MarkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    exam_id: UUID
    marks_obtained: int
    grade: str | None
    created_at: datetime
    updated_at: datetime


class StudentResult(BaseModel):
    student_id: UUID
    student_name: str
    roll_number: str
    marks: list[MarkResponse]
    total_marks_obtained: int
    total_marks_possible: int
    percentage: float
    overall_grade: str
