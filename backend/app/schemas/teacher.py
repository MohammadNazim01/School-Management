from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class TeacherCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    employee_id: str
    phone: str | None = None
    address: str | None = None
    qualification: str | None = None
    salary: float | None = None
    joining_date: date


class TeacherUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    address: str | None = None
    qualification: str | None = None
    salary: float | None = None


class TeacherResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    first_name: str
    last_name: str
    employee_id: str
    phone: str | None
    address: str | None
    qualification: str | None
    salary: float | None
    joining_date: date
    created_at: datetime
