import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class Student(Base):
    __tablename__ = "students"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    roll_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[str] = mapped_column(String(10), nullable=False)
    phone: Mapped[str] = mapped_column(String(20))
    address: Mapped[str] = mapped_column(Text)
    class_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    section_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sections.id"), nullable=False)
    parent_name: Mapped[str] = mapped_column(String(200))
    parent_phone: Mapped[str] = mapped_column(String(20))
    admission_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="student")
    class_: Mapped["Class"] = relationship("Class", back_populates="students")
    section: Mapped["Section"] = relationship("Section", back_populates="students")
    attendance_records: Mapped[list["Attendance"]] = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    marks: Mapped[list["Mark"]] = relationship("Mark", back_populates="student", cascade="all, delete-orphan")
    fees: Mapped[list["Fee"]] = relationship("Fee", back_populates="student", cascade="all, delete-orphan")
