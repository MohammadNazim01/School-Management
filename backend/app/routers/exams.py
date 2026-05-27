from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_teacher_or_admin
from app.database.connection import get_db
from app.models.exam import Exam
from app.models.user import User
from app.schemas.exam import ExamCreate, ExamResponse, ExamUpdate

router = APIRouter(prefix="/exams", tags=["Exams"])


@router.post("", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam(data: ExamCreate, db: Session = Depends(get_db), _: User = Depends(require_teacher_or_admin)):
    exam = Exam(**data.model_dump())
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam


@router.get("", response_model=list[ExamResponse])
def list_exams(
    class_id: UUID | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Exam)
    if class_id:
        q = q.filter(Exam.class_id == class_id)
    return q.order_by(Exam.exam_date).all()


@router.get("/{exam_id}", response_model=ExamResponse)
def get_exam(exam_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam


@router.put("/{exam_id}", response_model=ExamResponse)
def update_exam(exam_id: UUID, data: ExamUpdate, db: Session = Depends(get_db), _: User = Depends(require_teacher_or_admin)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(exam, field, value)
    db.commit()
    db.refresh(exam)
    return exam


@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(exam_id: UUID, db: Session = Depends(get_db), _: User = Depends(require_teacher_or_admin)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.delete(exam)
    db.commit()
