from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_admin
from app.database.connection import get_db
from app.models.class_ import Class, Section
from app.models.user import User
from app.schemas.class_ import (
    ClassCreate, ClassResponse, ClassUpdate,
    SectionCreate, SectionResponse, SectionUpdate,
)

router = APIRouter(prefix="/classes", tags=["Classes & Sections"])


@router.post("", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(data: ClassCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(Class).filter(Class.name == data.name).first():
        raise HTTPException(status_code=409, detail="Class name already exists")
    cls = Class(name=data.name)
    db.add(cls)
    db.commit()
    db.refresh(cls)
    return cls


@router.get("", response_model=list[ClassResponse])
def list_classes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Class).all()


@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    return cls


@router.put("/{class_id}", response_model=ClassResponse)
def update_class(class_id: UUID, data: ClassUpdate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    if data.name:
        cls.name = data.name
    db.commit()
    db.refresh(cls)
    return cls


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(class_id: UUID, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(cls)
    db.commit()


# Sections
@router.post("/{class_id}/sections", response_model=SectionResponse, status_code=status.HTTP_201_CREATED)
def create_section(class_id: UUID, data: SectionCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    section = Section(name=data.name, class_id=class_id)
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.get("/{class_id}/sections", response_model=list[SectionResponse])
def list_sections(class_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Section).filter(Section.class_id == class_id).all()
