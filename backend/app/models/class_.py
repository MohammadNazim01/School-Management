import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class Class(Base):
    __tablename__ = "classes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    sections: Mapped[list["Section"]] = relationship("Section", back_populates="class_", cascade="all, delete-orphan")
    students: Mapped[list["Student"]] = relationship("Student", back_populates="class_")
    subjects: Mapped[list["Subject"]] = relationship("Subject", back_populates="class_")
    timetables: Mapped[list["Timetable"]] = relationship("Timetable", back_populates="class_")


class Section(Base):
    __tablename__ = "sections"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(10), nullable=False)
    class_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    class_: Mapped["Class"] = relationship("Class", back_populates="sections")
    students: Mapped[list["Student"]] = relationship("Student", back_populates="section")
    timetables: Mapped[list["Timetable"]] = relationship("Timetable", back_populates="section")
