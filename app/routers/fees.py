from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_admin
from app.database.connection import get_db
from app.models.fee import FeeStatus
from app.models.user import User
from app.schemas.fee import FeeCreate, FeeResponse, FeeUpdate
from app.services import fees as fees_service

router = APIRouter(prefix="/fees", tags=["Fees"])


@router.post("", response_model=FeeResponse, status_code=status.HTTP_201_CREATED)
def create_fee(data: FeeCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return fees_service.create_fee(data, db)


@router.get("/students/{student_id}", response_model=list[FeeResponse])
def list_student_fees(
    student_id: UUID,
    fee_status: FeeStatus | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return fees_service.list_student_fees(student_id, db, status=fee_status)


@router.put("/{fee_id}", response_model=FeeResponse)
def update_fee(fee_id: UUID, data: FeeUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return fees_service.update_fee(fee_id, data, db)


@router.delete("/{fee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fee(fee_id: UUID, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    fees_service.delete_fee(fee_id, db)
