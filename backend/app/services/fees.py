from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.fee import Fee, FeeStatus
from app.schemas.fee import FeeCreate, FeeUpdate


def create_fee(data: FeeCreate, db: Session) -> Fee:
    fee = Fee(**data.model_dump())
    db.add(fee)
    db.commit()
    db.refresh(fee)
    return fee


def get_fee_or_404(fee_id: UUID, db: Session) -> Fee:
    fee = db.query(Fee).filter(Fee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fee record not found")
    return fee


def update_fee(fee_id: UUID, data: FeeUpdate, db: Session) -> Fee:
    fee = get_fee_or_404(fee_id, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(fee, field, value)
    db.commit()
    db.refresh(fee)
    return fee


def list_student_fees(student_id: UUID, db: Session, status: FeeStatus | None = None) -> list[Fee]:
    q = db.query(Fee).filter(Fee.student_id == student_id)
    if status:
        q = q.filter(Fee.status == status)
    return q.order_by(Fee.due_date).all()


def delete_fee(fee_id: UUID, db: Session) -> None:
    fee = get_fee_or_404(fee_id, db)
    db.delete(fee)
    db.commit()
