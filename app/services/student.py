from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.student import Student
from app.models.user import User, UserRole
from app.schemas.student import StudentCreate, StudentUpdate


def create_student(data: StudentCreate, db: Session) -> Student:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=data.email, password_hash=hash_password(data.password), role=UserRole.STUDENT)
    db.add(user)
    db.flush()

    student = Student(
        user_id=user.id,
        first_name=data.first_name,
        last_name=data.last_name,
        roll_number=data.roll_number,
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        phone=data.phone,
        address=data.address,
        class_id=data.class_id,
        section_id=data.section_id,
        parent_name=data.parent_name,
        parent_phone=data.parent_phone,
        admission_date=data.admission_date,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def get_student_or_404(student_id: UUID, db: Session) -> Student:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


def list_students(db: Session, class_id: UUID | None = None, skip: int = 0, limit: int = 50) -> list[Student]:
    q = db.query(Student)
    if class_id:
        q = q.filter(Student.class_id == class_id)
    return q.offset(skip).limit(limit).all()


def update_student(student_id: UUID, data: StudentUpdate, db: Session) -> Student:
    student = get_student_or_404(student_id, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def delete_student(student_id: UUID, db: Session) -> None:
    student = get_student_or_404(student_id, db)
    user = db.query(User).filter(User.id == student.user_id).first()
    db.delete(student)
    if user:
        db.delete(user)
    db.commit()
