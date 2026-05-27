from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ClassCreate(BaseModel):
    name: str


class ClassUpdate(BaseModel):
    name: str | None = None


class ClassResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    created_at: datetime


class SectionCreate(BaseModel):
    name: str
    class_id: UUID


class SectionUpdate(BaseModel):
    name: str | None = None


class SectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    class_id: UUID
    created_at: datetime
