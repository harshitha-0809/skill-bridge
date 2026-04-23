from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_manager
from app.models.program import Program
from app.models.user import User
from app.schemas.schemas import ProgramCreate, ProgramOut, RecommendationOut
from app.ml.recommendations import get_program_recommendations

router = APIRouter()

@router.get("/", response_model=List[ProgramOut])
def list_programs(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    q = db.query(Program)
    if category:   q = q.filter(Program.category == category)
    if difficulty: q = q.filter(Program.difficulty == difficulty)
    return q.order_by(Program.created_at.desc()).all()

@router.post("/", response_model=ProgramOut)
def create_program(
    prog_in: ProgramCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_manager)
):
    program = Program(**prog_in.model_dump())
    db.add(program)
    db.commit()
    db.refresh(program)
    return program

@router.get("/{program_id}", response_model=ProgramOut)
def get_program(program_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    prog = db.query(Program).filter(Program.id == program_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    return prog

@router.put("/{program_id}", response_model=ProgramOut)
def update_program(
    program_id: int,
    prog_in: ProgramCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_manager)
):
    prog = db.query(Program).filter(Program.id == program_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    for k, v in prog_in.model_dump().items():
        setattr(prog, k, v)
    db.commit()
    db.refresh(prog)
    return prog

@router.delete("/{program_id}")
def delete_program(program_id: int, db: Session = Depends(get_db), _: User = Depends(require_manager)):
    prog = db.query(Program).filter(Program.id == program_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    db.delete(prog)
    db.commit()
    return {"message": "Program deleted"}

@router.get("/recommendations", response_model=List[RecommendationOut])
def get_recommendations(
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get personalized program recommendations for the current user.
    """
    recommendations = get_program_recommendations(current_user, db, top_n=limit)
    return recommendations
