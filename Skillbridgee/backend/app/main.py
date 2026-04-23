from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import employees, programs, enrollments, auth, analytics
from app.core.database import engine, Base
from app.core.config import settings
from app.models import User, Program, Enrollment  # Import models for SQLAlchemy

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillBridge API",
    description="Employee skill tracking platform",
    version="1.0.0",
)

# Allow both local dev and the deployed Vercel frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    settings.FRONTEND_URL,
    # Wildcard for Vercel preview deployments (*.vercel.app)
    "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,        prefix="/api/auth",        tags=["Auth"])
app.include_router(employees.router,   prefix="/api/employees",   tags=["Employees"])
app.include_router(programs.router,    prefix="/api/programs",    tags=["Programs"])
app.include_router(enrollments.router, prefix="/api/enrollments", tags=["Enrollments"])
app.include_router(analytics.router,   prefix="/api/analytics",   tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "SkillBridge API is running ✅"}
