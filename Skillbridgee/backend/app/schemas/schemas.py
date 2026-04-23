from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# --- Auth ---
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: Optional[str] = "employee"
    department: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    department: Optional[str]
    is_active: bool
    created_at: datetime
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# --- Programs ---
class ProgramCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = "beginner"
    duration_hrs: Optional[float] = 0
    skills: Optional[List[str]] = []
    provider: Optional[str] = None

class ProgramOut(ProgramCreate):
    id: int
    created_at: datetime
    class Config: from_attributes = True

# --- Enrollments ---
class EnrollmentCreate(BaseModel):
    program_id: int
    notes: Optional[str] = None

class EnrollmentUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[float] = None
    notes: Optional[str] = None

class EnrollmentOut(BaseModel):
    id: int
    employee_id: int
    program_id: int
    status: str
    progress: float
    enrolled_at: datetime
    completed_at: Optional[datetime]
    notes: Optional[str]
    program: ProgramOut
    class Config: from_attributes = True

# --- Analytics ---
class DeptSummary(BaseModel):
    department: str
    total_employees: int
    active_enrollments: int
    completed_programs: int
    avg_progress: float

class OrgAnalytics(BaseModel):
    total_employees: int
    total_programs: int
    total_enrollments: int
    completion_rate: float
    by_department: List[DeptSummary]
    top_programs: List[dict]

# --- Recommendations ---
class RecommendationOut(BaseModel):
    program: ProgramOut
    score: float
    skill_coverage: List[dict]
