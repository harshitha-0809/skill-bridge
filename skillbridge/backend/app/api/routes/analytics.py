from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from app.core.database import get_db
from app.core.security import require_manager
from app.models.user import User
from app.models.program import Enrollment, Program, StatusEnum

router = APIRouter()

@router.get("/org")
def org_analytics(db: Session = Depends(get_db), _: User = Depends(require_manager)):
    total_employees  = db.query(User).filter(User.is_active == True).count()
    total_programs   = db.query(Program).count()
    total_enrollments = db.query(Enrollment).count()
    completed = db.query(Enrollment).filter(Enrollment.status == StatusEnum.completed).count()
    completion_rate  = round((completed / total_enrollments * 100) if total_enrollments else 0, 1)

    # By department
    employees = db.query(User).filter(User.is_active == True).all()
    dept_map = defaultdict(lambda: {"total": 0, "active": 0, "completed": 0, "progress_sum": 0, "progress_count": 0})
    for emp in employees:
        dept = emp.department or "Unassigned"
        dept_map[dept]["total"] += 1
        for e in emp.enrollments:
            if e.status == StatusEnum.in_progress.value:
                dept_map[dept]["active"] += 1
            if e.status == StatusEnum.completed.value:
                dept_map[dept]["completed"] += 1
            dept_map[dept]["progress_sum"] += e.progress
            dept_map[dept]["progress_count"] += 1

    by_dept = []
    for dept, d in dept_map.items():
        avg_prog = round(d["progress_sum"] / d["progress_count"], 1) if d["progress_count"] else 0
        by_dept.append({
            "department": dept,
            "total_employees": d["total"],
            "active_enrollments": d["active"],
            "completed_programs": d["completed"],
            "avg_progress": avg_prog,
        })

    # Top programs by enrollment count
    top = (
        db.query(Program.title, func.count(Enrollment.id).label("count"))
        .join(Enrollment)
        .group_by(Program.id)
        .order_by(func.count(Enrollment.id).desc())
        .limit(5)
        .all()
    )

    # Skill coverage
    programs = db.query(Program).all()
    skill_counts = defaultdict(int)
    for p in programs:
        for s in (p.skills or []):
            skill_counts[s] += 1
    skill_coverage = sorted(
        [{"skill": k, "programs": v} for k, v in skill_counts.items()],
        key=lambda x: x["programs"], reverse=True
    )[:10]

    return {
        "total_employees": total_employees,
        "total_programs": total_programs,
        "total_enrollments": total_enrollments,
        "completion_rate": completion_rate,
        "by_department": by_dept,
        "top_programs": [{"title": t, "enrollments": c} for t, c in top],
        "skill_coverage": skill_coverage,
    }
