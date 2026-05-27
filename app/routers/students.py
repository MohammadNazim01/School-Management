from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_admin
from app.database.connection import get_db
from app.models.user import User, UserRole
from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate
from app.services import student as student_service

router = APIRouter(prefix="/students", tags=["Students"])


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return student_service.create_student(data, db)


@router.get("", response_model=list[StudentResponse])
def list_students(
    class_id: UUID | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return student_service.list_students(db, class_id=class_id, skip=skip, limit=limit)


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = student_service.get_student_or_404(student_id, db)
    # Students can only view their own profile
    if current_user.role == UserRole.STUDENT:
        if not student.user_id == current_user.id:
            from fastapi import HTTPException
            raise HTTPException(status_code=403, detail="Access denied")
    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: UUID,
    data: StudentUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return student_service.update_student(student_id, data, db)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    student_service.delete_student(student_id, db)
