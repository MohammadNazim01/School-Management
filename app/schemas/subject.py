from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SubjectCreate(BaseModel):
    name: str
    code: str
    class_id: UUID
    teacher_id: UUID | None = None


class SubjectUpdate(BaseModel):
    name: str | None = None
    teacher_id: UUID | None = None


class SubjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    code: str
    class_id: UUID
    teacher_id: UUID | None
    created_at: datetime
