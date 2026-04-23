"""
Seed the database with sample data for development.
Run: python seed.py
"""
import sys, os
sys.path.append(os.path.dirname(__file__))

from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.user import User, RoleEnum
from app.models.program import Program, Enrollment, StatusEnum, DifficultyEnum
from datetime import datetime, timedelta
import random

Base.metadata.create_all(bind=engine)
db = SessionLocal()

print(" Seeding database...")

# ── Users ────────────────────────────────────────────────────────────────────
users_data = [
    dict(email="admin@skillbridge.dev",   full_name="Admin User",       role=RoleEnum.admin,    department="Engineering",  password="admin123"),
    dict(email="manager@skillbridge.dev", full_name="Ravi Kumar",        role=RoleEnum.manager,  department="Engineering",  password="manager123"),
    dict(email="hr@skillbridge.dev",      full_name="Ananya Reddy",      role=RoleEnum.hr,       department="HR",           password="hr123"),
    dict(email="priya@skillbridge.dev",   full_name="Priya Sharma",      role=RoleEnum.employee, department="Engineering",  password="employee123"),
    dict(email="arjun@skillbridge.dev",   full_name="Arjun Patel",       role=RoleEnum.employee, department="Product",      password="employee123"),
    dict(email="meera@skillbridge.dev",   full_name="Meera Nair",        role=RoleEnum.employee, department="Design",       password="employee123"),
    dict(email="vikram@skillbridge.dev",  full_name="Vikram Singh",      role=RoleEnum.employee, department="Engineering",  password="employee123"),
    dict(email="kavya@skillbridge.dev",   full_name="Kavya Iyer",        role=RoleEnum.employee, department="Marketing",    password="employee123"),
    dict(email="rohit@skillbridge.dev",   full_name="Rohit Verma",       role=RoleEnum.employee, department="Sales",        password="employee123"),
    dict(email="divya@skillbridge.dev",   full_name="Divya Menon",       role=RoleEnum.employee, department="Data",         password="employee123"),
]

created_users = []
for u in users_data:
    existing = db.query(User).filter(User.email == u["email"]).first()
    if not existing:
        user = User(
            email=u["email"],
            full_name=u["full_name"],
            hashed_password=hash_password(u["password"]),
            role=u["role"],
            department=u["department"],
        )
        db.add(user)
        created_users.append(user)
        print(f"  ✓ User: {u['full_name']} ({u['role']})")

db.commit()

# ── Programs ─────────────────────────────────────────────────────────────────
programs_data = [
    dict(
        title="Python for Data Science",
        description="Master Python fundamentals with a focus on data manipulation, visualization, and analysis using pandas, NumPy, and matplotlib.",
        category="Data", difficulty=DifficultyEnum.beginner, duration_hrs=20,
        skills=["Python", "Pandas", "NumPy", "Data Analysis"], provider="Coursera"
    ),
    dict(
        title="Leadership Fundamentals",
        description="Develop essential leadership skills — effective communication, team motivation, conflict resolution, and strategic thinking.",
        category="Leadership", difficulty=DifficultyEnum.intermediate, duration_hrs=12,
        skills=["Leadership", "Communication", "Team Management"], provider="LinkedIn Learning"
    ),
    dict(
        title="Advanced SQL & Query Optimization",
        description="Deep dive into advanced SQL techniques including window functions, CTEs, indexing strategies, and query performance tuning.",
        category="Data", difficulty=DifficultyEnum.advanced, duration_hrs=16,
        skills=["SQL", "PostgreSQL", "Performance Tuning", "Database Design"], provider="Udemy"
    ),
    dict(
        title="React & Modern Frontend Development",
        description="Build production-grade React applications with hooks, context, React Router, and modern tooling including Vite and TypeScript.",
        category="Engineering", difficulty=DifficultyEnum.intermediate, duration_hrs=30,
        skills=["React", "JavaScript", "TypeScript", "Vite", "TailwindCSS"], provider="Frontend Masters"
    ),
    dict(
        title="Machine Learning Fundamentals",
        description="Introduction to ML concepts: supervised and unsupervised learning, model evaluation, scikit-learn, and practical project work.",
        category="Data", difficulty=DifficultyEnum.intermediate, duration_hrs=40,
        skills=["Machine Learning", "Python", "scikit-learn", "Statistics"], provider="Coursera"
    ),
    dict(
        title="UX Design & Prototyping",
        description="Learn user research methods, information architecture, wireframing, and high-fidelity prototyping with Figma.",
        category="Design", difficulty=DifficultyEnum.beginner, duration_hrs=18,
        skills=["UX Design", "Figma", "User Research", "Prototyping"], provider="Google UX Certificate"
    ),
    dict(
        title="Cloud Architecture on AWS",
        description="Design and deploy scalable cloud solutions using AWS services — EC2, S3, RDS, Lambda, and infrastructure as code with Terraform.",
        category="Engineering", difficulty=DifficultyEnum.advanced, duration_hrs=35,
        skills=["AWS", "Cloud Architecture", "Terraform", "DevOps"], provider="A Cloud Guru"
    ),
    dict(
        title="Effective Communication & Presentation",
        description="Develop compelling storytelling, data presentation skills, and executive communication techniques for professional settings.",
        category="Communication", difficulty=DifficultyEnum.beginner, duration_hrs=8,
        skills=["Communication", "Presentation", "Storytelling"], provider="Internal"
    ),
    dict(
        title="FastAPI & Python Backend Development",
        description="Build modern, high-performance REST APIs with FastAPI, SQLAlchemy ORM, JWT authentication, and Docker deployment.",
        category="Engineering", difficulty=DifficultyEnum.intermediate, duration_hrs=24,
        skills=["FastAPI", "Python", "PostgreSQL", "Docker", "REST API"], provider="Internal"
    ),
    dict(
        title="Product Management Essentials",
        description="Core product management skills — user stories, roadmapping, prioritization frameworks, stakeholder management, and metrics.",
        category="Management", difficulty=DifficultyEnum.intermediate, duration_hrs=15,
        skills=["Product Management", "Roadmapping", "Agile", "Analytics"], provider="Product School"
    ),
    dict(
        title="Data Visualization with Tableau",
        description="Create interactive dashboards and compelling data stories using Tableau. Covers calculated fields, LOD expressions, and best practices.",
        category="Data", difficulty=DifficultyEnum.beginner, duration_hrs=12,
        skills=["Tableau", "Data Visualization", "Analytics"], provider="Tableau eLearning"
    ),
    dict(
        title="Kubernetes & Container Orchestration",
        description="Run and manage containerized applications at scale with Kubernetes. Covers pods, deployments, services, ingress, and Helm charts.",
        category="Engineering", difficulty=DifficultyEnum.advanced, duration_hrs=28,
        skills=["Kubernetes", "Docker", "DevOps", "Cloud Native"], provider="Linux Foundation"
    ),
]

created_programs = []
for p in programs_data:
    existing = db.query(Program).filter(Program.title == p["title"]).first()
    if not existing:
        prog = Program(**p)
        db.add(prog)
        created_programs.append(prog)
        print(f"  ✓ Program: {p['title']}")

db.commit()

# ── Enrollments ───────────────────────────────────────────────────────────────
all_users    = db.query(User).filter(User.role == RoleEnum.employee).all()
all_programs = db.query(Program).all()

statuses = [StatusEnum.not_started, StatusEnum.in_progress, StatusEnum.in_progress, StatusEnum.completed]

enrollment_count = 0
for user in all_users:
    sample_programs = random.sample(all_programs, min(random.randint(2, 5), len(all_programs)))
    for prog in sample_programs:
        existing = db.query(Enrollment).filter(
            Enrollment.employee_id == user.id,
            Enrollment.program_id  == prog.id
        ).first()
        if existing:
            continue
        status   = random.choice(statuses)
        progress = 100.0 if status == StatusEnum.completed else (
            0.0 if status == StatusEnum.not_started else random.randint(10, 90) * 1.0
        )
        enrolled_at  = datetime.utcnow() - timedelta(days=random.randint(1, 120))
        completed_at = enrolled_at + timedelta(days=random.randint(7, 60)) if status == StatusEnum.completed else None

        enrollment = Enrollment(
            employee_id=user.id,
            program_id=prog.id,
            status=status,
            progress=progress,
            enrolled_at=enrolled_at,
            completed_at=completed_at,
        )
        db.add(enrollment)
        enrollment_count += 1

db.commit()
db.close()

print(f"\n✅ Seeding complete!")
print(f"   Users: {len(users_data)}")
print(f"   Programs: {len(programs_data)}")
print(f"   Enrollments: {enrollment_count}")
print(f"\n🔑 Login credentials:")
print(f"   Admin:    admin@skillbridge.dev / admin123")
print(f"   Manager:  manager@skillbridge.dev / manager123")
print(f"   HR:       hr@skillbridge.dev / hr123")
print(f"   Employee: priya@skillbridge.dev / employee123")
