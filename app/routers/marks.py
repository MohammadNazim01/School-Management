from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_teacher_or_admin
from app.database.connection import get_db
from app.models.user import User
from app.schemas.mark import MarkCreate, MarkResponse, MarkUpdate, StudentResult
from app.services import marks as marks_service

router = APIRouter(prefix="/marks", tags=["Marks"])


@router.post("", response_model=MarkResponse, status_code=status.HTTP_201_CREATED)
def add_mark(data: MarkCreate, db: Session = Depends(get_db), _: User = Depends(require_teacher_or_admin)):
    return marks_service.add_mark(data, db)


@router.put("/{mark_id}", response_model=MarkResponse)
def update_mark(mark_id: UUID, data: MarkUpdate, db: Session = Depends(get_db), _: User = Depends(require_teacher_or_admin)):
    return marks_service.update_mark(mark_id, data, db)


@router.get("/students/{student_id}/result", response_model=StudentResult)
def get_student_result(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return marks_service.get_student_result(student_id, db)
