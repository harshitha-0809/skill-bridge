#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "  SkillBridge — Starting up..."
echo "=========================================="
echo ""

# ── Checks ───────────────────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo -e "${RED}[ERROR]${NC} Python 3 not found. Install from https://python.org"
  exit 1
fi

if ! command -v node &>/dev/null; then
  echo -e "${RED}[ERROR]${NC} Node.js not found. Install from https://nodejs.org"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── Backend ──────────────────────────────────────────────────────────────────
echo -e "${YELLOW}[1/4]${NC} Setting up Python virtual environment..."
cd "$ROOT/backend"

if [ ! -d venv ]; then
  python3 -m venv venv
fi

source venv/bin/activate

echo -e "${YELLOW}[2/4]${NC} Installing backend dependencies..."
pip install -r requirements.txt -q

if [ ! -f .env ]; then
  cp .env.example .env
  echo "      Created backend/.env (SQLite mode)"
fi

echo -e "${YELLOW}[3/4]${NC} Starting FastAPI on http://localhost:8000 ..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# ── Frontend ─────────────────────────────────────────────────────────────────
echo -e "${YELLOW}[4/4]${NC} Installing and starting React frontend..."
cd "$ROOT/frontend"

if [ ! -d node_modules ]; then
  echo "      Running npm install, please wait..."
  npm install
fi

npm run dev &
FRONTEND_PID=$!

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}=========================================="
echo "  All services running!"
echo "  Frontend : http://localhost:5173"
echo "  API Docs : http://localhost:8000/docs"
echo -e "==========================================${NC}"
echo ""
echo "  Login after seeding (cd backend && python seed.py):"
echo "    Employee : priya@skillbridge.dev / employee123"
echo "    Manager  : manager@skillbridge.dev / manager123"
echo ""
echo "  Press Ctrl+C to stop all services."
echo ""

trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
