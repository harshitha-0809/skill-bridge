from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey, Text
from sqlalchemy.types import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import enum

class DifficultyEnum(str, enum.Enum):
    beginner     = "beginner"
    intermediate = "intermediate"
    advanced     = "advanced"

class StatusEnum(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed   = "completed"
    dropped     = "dropped"

class Program(Base):
    __tablename__ = "programs"
    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String, nullable=False)
    description  = Column(Text)
    category     = Column(String)
    difficulty   = Column(Enum(DifficultyEnum), default=DifficultyEnum.beginner)
    duration_hrs = Column(Float, default=0)
    skills       = Column(JSON, default=list)   # list of skill strings
    provider     = Column(String)
    created_at   = Column(DateTime, default=datetime.utcnow)

    enrollments = relationship("Enrollment", back_populates="program")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id          = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id  = Column(Integer, ForeignKey("programs.id"), nullable=False)
    status      = Column(Enum(StatusEnum), default=StatusEnum.not_started)
    progress    = Column(Float, default=0.0)   # 0-100
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    notes       = Column(Text, nullable=True)

    employee = relationship("User", back_populates="enrollments")
    program  = relationship("Program", back_populates="enrollments")
