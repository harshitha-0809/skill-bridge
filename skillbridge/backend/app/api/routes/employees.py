from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, require_manager
from app.models.user import User
from app.schemas.schemas import UserOut

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def list_employees(db: Session = Depends(get_db), _: User = Depends(require_manager)):
    return db.query(User).filter(User.is_active == True).all()

@router.get("/{employee_id}", response_model=UserOut)
def get_employee(employee_id: int, db: Session = Depends(get_db), _: User = Depends(require_manager)):
    return db.query(User).filter(User.id == employee_id).first()
