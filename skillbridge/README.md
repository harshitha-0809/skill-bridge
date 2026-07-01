# SkillBridge — Employee Learning Profile Platform

Track employee learning programs for both employees and organizations.
**No Docker, no database setup — runs on SQLite out of the box.**

---

## Requirements

- Python 3.11+ → https://python.org/downloads
- Node.js 20+  → https://nodejs.org/en/download

That's it. SQLite is built into Python, so no database install needed.

---

## ▶ Start (One Command)

### Windows
Double-click `start.bat`
or in a terminal:
```cmd
start.bat
```

### Mac / Linux
```bash
chmod +x start.sh
./start.sh
```

Both scripts will:
1. Create a Python virtual environment
2. Install all backend packages
3. Start the FastAPI backend on http://localhost:8000
4. Install npm packages
5. Start the React frontend on http://localhost:5173

---

## Seed Sample Data

After first start, open a second terminal and run:

```bash
# Windows
cd backend
venv\Scripts\activate
python seed.py

# Mac / Linux
cd backend
source venv/bin/activate
python seed.py
```

### Login credentials after seeding

| Role     | Email                       | Password     |
|----------|-----------------------------|--------------|
| Admin    | admin@skillbridge.dev       | admin123     |
| Manager  | manager@skillbridge.dev     | manager123   |
| HR       | hr@skillbridge.dev          | hr123        |
| Employee | priya@skillbridge.dev       | employee123  |

---

## Manual Start (step by step)

### Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
→ API running at http://localhost:8000
→ Interactive docs at http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
→ App running at http://localhost:5173

---

## Upgrade to PostgreSQL (production)

1. Install PostgreSQL and create a database
2. Edit `backend/.env`:
```
DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/skillbridge
```
3. Install the driver: `pip install psycopg2-binary`
4. Restart the backend

---

## Project Structure

```
skillbridge/
├── start.sh / start.bat         ← One-click launcher
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI entry point
│   │   ├── core/                ← Config, DB, JWT auth
│   │   ├── models/              ← SQLAlchemy models
│   │   ├── schemas/             ← Pydantic schemas
│   │   └── api/routes/          ← All API endpoints
│   ├── seed.py                  ← Sample data loader
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── pages/               ← Login, Dashboard, Programs, Org, Employees
        ├── components/shared/   ← UI library
        ├── api/                 ← Axios client + service functions
        ├── context/             ← Auth state (React context)
        └── hooks/               ← useFetch, useAsync
```

---

## API Docs

Visit http://localhost:8000/docs after starting the backend — interactive Swagger UI for all endpoints.
