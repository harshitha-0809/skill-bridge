# SkillBridge — Employee Learning Profile Platform

Track employee skill programs for both employees and organizations.

## Quick Links
- **Deploy guide:** See [DEPLOY.md](./DEPLOY.md) — Vercel + Render, free tier, ~10 min setup
- **Local dev:** See below

## Local Development

```bash
# Backend
cd backend && python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload   # → http://localhost:8000/docs

# Frontend (new terminal)
cd frontend && npm install
npm run dev                     # → http://localhost:5173

# Seed sample data
cd backend && python seed.py
```

## Stack
| Layer    | Tech                          | Hosted on |
|----------|-------------------------------|-----------|
| Frontend | React 18 + Vite + TailwindCSS | Vercel    |
| Backend  | FastAPI (Python 3.11)         | Render    |
| Database | PostgreSQL (SQLite for local) | Render    |
