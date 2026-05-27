from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth.password import hash_password
from app.models.teacher import Teacher
from app.models.user import User, UserRole
from app.schemas.teacher import TeacherCreate, TeacherUpdate


def create_teacher(data: TeacherCreate, db: Session) -> Teacher:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=data.email, password_hash=hash_password(data.password), role=UserRole.TEACHER)
    db.add(user)
    db.flush()

    teacher = Teacher(
        user_id=user.id,
        first_name=data.first_name,
        last_name=data.last_name,
        employee_id=data.employee_id,
        phone=data.phone,
        address=data.address,
        qualification=data.qualification,
        salary=data.salary,
        joining_date=data.joining_date,
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


def get_teacher_or_404(teacher_id: UUID, db: Session) -> Teacher:
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")
    return teacher


def list_teachers(db: Session, skip: int = 0, limit: int = 50) -> list[Teacher]:
    return db.query(Teacher).offset(skip).limit(limit).all()


def update_teacher(teacher_id: UUID, data: TeacherUpdate, db: Session) -> Teacher:
    teacher = get_teacher_or_404(teacher_id, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(teacher, field, value)
    db.commit()
    db.refresh(teacher)
    return teacher


def delete_teacher(teacher_id: UUID, db: Session) -> None:
    teacher = get_teacher_or_404(teacher_id, db)
    user = db.query(User).filter(User.id == teacher.user_id).first()
    db.delete(teacher)
    if user:
        db.delete(user)
    db.commit()
