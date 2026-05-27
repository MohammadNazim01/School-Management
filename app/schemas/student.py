from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class StudentCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    roll_number: str
    date_of_birth: date
    gender: str
    phone: str | None = None
    address: str | None = None
    class_id: UUID
    section_id: UUID
    parent_name: str | None = None
    parent_phone: str | None = None
    admission_date: date


class StudentUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    address: str | None = None
    class_id: UUID | None = None
    section_id: UUID | None = None
    parent_name: str | None = None
    parent_phone: str | None = None


class StudentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    first_name: str
    last_name: str
    roll_number: str
    date_of_birth: date
    gender: str
    phone: str | None
    address: str | None
    class_id: UUID
    section_id: UUID
    parent_name: str | None
    parent_phone: str | None
    admission_date: date
    created_at: datetime
