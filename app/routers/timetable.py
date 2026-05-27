from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_admin
from app.database.connection import get_db
from app.models.timetable import Timetable
from app.models.user import User
from app.schemas.timetable import TimetableCreate, TimetableResponse, TimetableUpdate

router = APIRouter(prefix="/timetable", tags=["Timetable"])


@router.post("", response_model=TimetableResponse, status_code=status.HTTP_201_CREATED)
def create_entry(data: TimetableCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    entry = Timetable(**data.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/class/{class_id}", response_model=list[TimetableResponse])
def get_class_timetable(
    class_id: UUID,
    section_id: UUID | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Timetable).filter(Timetable.class_id == class_id)
    if section_id:
        q = q.filter(Timetable.section_id == section_id)
    return q.order_by(Timetable.day_of_week, Timetable.start_time).all()


@router.get("/teacher/{teacher_id}", response_model=list[TimetableResponse])
def get_teacher_timetable(
    teacher_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Timetable)
        .filter(Timetable.teacher_id == teacher_id)
        .order_by(Timetable.day_of_week, Timetable.start_time)
        .all()
    )


@router.put("/{entry_id}", response_model=TimetableResponse)
def update_entry(entry_id: UUID, data: TimetableUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Timetable entry not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: UUID, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Timetable entry not found")
    db.delete(entry)
    db.commit()
