from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_admin
from app.database.connection import get_db
from app.models.user import User
from app.schemas.teacher import TeacherCreate, TeacherResponse, TeacherUpdate
from app.services import teacher as teacher_service

router = APIRouter(prefix="/teachers", tags=["Teachers"])


@router.post("", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED)
def create_teacher(
    data: TeacherCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return teacher_service.create_teacher(data, db)


@router.get("", response_model=list[TeacherResponse])
def list_teachers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return teacher_service.list_teachers(db, skip=skip, limit=limit)


@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(
    teacher_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return teacher_service.get_teacher_or_404(teacher_id, db)


@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(
    teacher_id: UUID,
    data: TeacherUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return teacher_service.update_teacher(teacher_id, data, db)


@router.delete("/{teacher_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_teacher(
    teacher_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    teacher_service.delete_teacher(teacher_id, db)
