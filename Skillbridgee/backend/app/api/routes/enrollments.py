from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, require_manager
from app.models.program import Enrollment, StatusEnum
from app.models.user import User
from app.schemas.schemas import EnrollmentCreate, EnrollmentUpdate, EnrollmentOut

router = APIRouter()

@router.get("/my", response_model=List[EnrollmentOut])
def my_enrollments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Enrollment).filter(Enrollment.employee_id == current_user.id).all()

@router.post("/", response_model=EnrollmentOut)
def enroll(
    enroll_in: EnrollmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Enrollment).filter(
        Enrollment.employee_id == current_user.id,
        Enrollment.program_id == enroll_in.program_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this program")
    enrollment = Enrollment(
        employee_id=current_user.id,
        program_id=enroll_in.program_id,
        notes=enroll_in.notes
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

@router.patch("/{enrollment_id}", response_model=EnrollmentOut)
def update_enrollment(
    enrollment_id: int,
    update: EnrollmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    enroll = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.employee_id == current_user.id
    ).first()
    if not enroll:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    data = update.model_dump(exclude_none=True)
    for k, v in data.items():
        setattr(enroll, k, v)
    if update.status == "completed" and not enroll.completed_at:
        enroll.completed_at = datetime.utcnow()
        enroll.progress = 100.0
    db.commit()
    db.refresh(enroll)
    return enroll

@router.get("/all", response_model=List[EnrollmentOut])
def all_enrollments(
    employee_id: int = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_manager)
):
    q = db.query(Enrollment)
    if employee_id:
        q = q.filter(Enrollment.employee_id == employee_id)
    return q.all()
