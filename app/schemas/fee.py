from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.fee import FeeStatus, FeeType


class FeeCreate(BaseModel):
    student_id: UUID
    fee_type: FeeType
    amount: float
    due_date: date


class FeeUpdate(BaseModel):
    status: FeeStatus | None = None
    paid_date: date | None = None
    receipt_number: str | None = None


class FeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    fee_type: FeeType
    amount: float
    due_date: date
    paid_date: date | None
    status: FeeStatus
    receipt_number: str | None
    created_at: datetime
