from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.exam import Exam
from app.models.mark import Mark
from app.models.student import Student
from app.schemas.mark import MarkCreate, MarkUpdate, StudentResult


def _calculate_grade(percentage: float) -> str:
    if percentage >= 90:
        return "A+"
    if percentage >= 80:
        return "A"
    if percentage >= 70:
        return "B+"
    if percentage >= 60:
        return "B"
    if percentage >= 50:
        return "C"
    if percentage >= 40:
        return "D"
    return "F"


def add_mark(data: MarkCreate, db: Session) -> Mark:
    exam = db.query(Exam).filter(Exam.id == data.exam_id).first()
    if not exam:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam not found")
    if data.marks_obtained > exam.total_marks:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marks obtained exceed total marks")

    existing = db.query(Mark).filter(Mark.student_id == data.student_id, Mark.exam_id == data.exam_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Marks already recorded for this exam")

    percentage = (data.marks_obtained / exam.total_marks) * 100
    mark = Mark(
        student_id=data.student_id,
        exam_id=data.exam_id,
        marks_obtained=data.marks_obtained,
        grade=_calculate_grade(percentage),
    )
    db.add(mark)
    db.commit()
    db.refresh(mark)
    return mark


def get_mark_or_404(mark_id: UUID, db: Session) -> Mark:
    mark = db.query(Mark).filter(Mark.id == mark_id).first()
    if not mark:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mark not found")
    return mark


def update_mark(mark_id: UUID, data: MarkUpdate, db: Session) -> Mark:
    mark = get_mark_or_404(mark_id, db)
    if data.marks_obtained is not None:
        exam = db.query(Exam).filter(Exam.id == mark.exam_id).first()
        if data.marks_obtained > exam.total_marks:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Marks obtained exceed total marks")
        percentage = (data.marks_obtained / exam.total_marks) * 100
        mark.marks_obtained = data.marks_obtained
        mark.grade = _calculate_grade(percentage)
    db.commit()
    db.refresh(mark)
    return mark


def get_student_result(student_id: UUID, db: Session) -> StudentResult:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    marks = db.query(Mark).filter(Mark.student_id == student_id).all()
    total_obtained = sum(m.marks_obtained for m in marks)
    total_possible = 0
    for mark in marks:
        exam = db.query(Exam).filter(Exam.id == mark.exam_id).first()
        if exam:
            total_possible += exam.total_marks

    percentage = round((total_obtained / total_possible * 100), 2) if total_possible > 0 else 0.0
    return StudentResult(
        student_id=student_id,
        student_name=f"{student.first_name} {student.last_name}",
        roll_number=student.roll_number,
        marks=marks,
        total_marks_obtained=total_obtained,
        total_marks_possible=total_possible,
        percentage=percentage,
        overall_grade=_calculate_grade(percentage),
    )
