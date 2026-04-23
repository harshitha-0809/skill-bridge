@echo off
title SkillBridge Launcher
color 0A

echo.
echo  ==========================================
echo   SkillBridge - Starting up...
echo  ==========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install from https://python.org
    pause & exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause & exit /b 1
)

REM ── Backend setup ────────────────────────────────────────────────────────
echo [1/4] Setting up Python virtual environment...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate.bat

echo [2/4] Installing backend dependencies...
pip install -r requirements.txt -q

REM Copy .env if missing
if not exist .env (
    copy .env.example .env >nul
    echo       Created backend\.env
)

echo [3/4] Starting FastAPI backend on http://localhost:8000 ...
start "SkillBridge API" cmd /k "venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

cd ..

REM ── Frontend setup ───────────────────────────────────────────────────────
echo [4/4] Installing and starting React frontend...
cd frontend
if not exist node_modules (
    echo       Running npm install, please wait...
    npm install
)
start "SkillBridge UI" cmd /k "npm run dev"
cd ..

echo.
echo  ==========================================
echo   All services started!
echo   Frontend : http://localhost:5173
echo   API Docs : http://localhost:8000/docs
echo  ==========================================
echo.
echo  Login credentials (after seeding):
echo    Employee : priya@skillbridge.dev / employee123
echo    Manager  : manager@skillbridge.dev / manager123
echo.
echo  To seed sample data, run:
echo    cd backend ^& venv\Scripts\activate ^& python seed.py
echo.
pause
