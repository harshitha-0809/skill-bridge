# SkillBridge — Deployment Guide
## Vercel (Frontend) + Render (Backend + Database)

Both platforms have **free tiers** and deploy straight from GitHub. No CLI needed.

---

## Overview

```
GitHub Repo
  ├── frontend/   → Vercel   (React, global CDN)
  └── backend/    → Render   (FastAPI + PostgreSQL)
```

---

## Step 1 — Push to GitHub

1. Create a new repo at https://github.com/new  
   Name it `skillbridge`, set it to Public or Private.

2. From your project folder, run:
```bash
git init
git add .
git commit -m "Initial SkillBridge commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skillbridge.git
git push -u origin main
```

---

## Step 2 — Deploy Backend on Render

Render will host the FastAPI API **and** create the PostgreSQL database automatically.

### 2a. Create account
Go to https://render.com → Sign up (free, use GitHub login)

### 2b. Create the PostgreSQL database
1. Dashboard → **New +** → **PostgreSQL**
2. Fill in:
   - Name: `skillbridge-db`
   - Database: `skillbridge`
   - User: `skillbridge`
   - Plan: **Free**
3. Click **Create Database**
4. Wait ~1 min, then copy the **Internal Database URL** (starts with `postgres://...`)

### 2c. Create the Web Service
1. Dashboard → **New +** → **Web Service**
2. Connect your GitHub repo
3. Fill in settings:

| Field           | Value                                              |
|-----------------|----------------------------------------------------|
| Name            | `skillbridge-api`                                  |
| Root Directory  | `backend`                                          |
| Runtime         | `Python 3`                                         |
| Build Command   | `pip install -r requirements.txt`                  |
| Start Command   | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Plan            | Free                                               |

4. Scroll to **Environment Variables** → Add these:

| Key            | Value                                    |
|----------------|------------------------------------------|
| `DATABASE_URL` | *(paste the Internal DB URL from 2b)*    |
| `SECRET_KEY`   | *(click "Generate" for a random value)*  |
| `FRONTEND_URL` | `https://your-app.vercel.app` *(fill in after Step 3)* |

5. Click **Create Web Service**

Render will build and deploy. Takes ~3 minutes.  
Your API will be live at: `https://skillbridge-api.onrender.com`

> ✅ Test it: open `https://skillbridge-api.onrender.com/docs` — you should see the Swagger UI.

### 2d. Seed the database (optional but recommended)

In the Render dashboard → your web service → **Shell** tab:
```bash
python seed.py
```

---

## Step 3 — Deploy Frontend on Vercel

### 3a. Create account
Go to https://vercel.com → Sign up (free, use GitHub login)

### 3b. Import project
1. Dashboard → **Add New** → **Project**
2. Import your GitHub repo `skillbridge`
3. Configure:

| Field               | Value          |
|---------------------|----------------|
| Framework Preset    | Vite           |
| Root Directory      | `frontend`     |
| Build Command       | `npm run build`|
| Output Directory    | `dist`         |

4. Expand **Environment Variables** → Add:

| Key            | Value                                         |
|----------------|-----------------------------------------------|
| `VITE_API_URL` | `https://skillbridge-api.onrender.com`         |

5. Click **Deploy**

Takes ~1 minute.  
Your app will be live at: `https://skillbridge-xyz.vercel.app`

---

## Step 4 — Connect them together

Now that both are deployed:

1. **Copy your Vercel URL** (e.g. `https://skillbridge.vercel.app`)
2. Go to **Render dashboard** → `skillbridge-api` → Environment
3. Update `FRONTEND_URL` to your Vercel URL
4. Click **Save Changes** — Render will redeploy automatically

---

## ✅ You're live!

| Service  | URL                                         |
|----------|---------------------------------------------|
| App      | `https://your-app.vercel.app`               |
| API      | `https://skillbridge-api.onrender.com`      |
| API Docs | `https://skillbridge-api.onrender.com/docs` |

Login after seeding:
- **Manager:** `manager@skillbridge.dev` / `manager123`
- **Employee:** `priya@skillbridge.dev` / `employee123`

---

## Local Development (still works)

```bash
# Backend (SQLite, no Postgres needed locally)
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

The Vite dev proxy (`vite.config.js`) forwards `/api` calls to `localhost:8000`  
so you don't need to set `VITE_API_URL` locally.

---

## Auto-deploys

Every `git push` to `main` triggers:
- Vercel rebuilds and redeploys the frontend (~30 sec)
- Render rebuilds and redeploys the backend (~2 min)

---

## Free Tier Notes

| Platform | Limit                                             |
|----------|---------------------------------------------------|
| Render   | Backend sleeps after 15 min idle (wakes in ~30s)  |
| Render   | PostgreSQL free tier expires after 90 days        |
| Vercel   | 100GB bandwidth/month, unlimited deploys          |

To keep the Render backend awake, use https://uptimerobot.com (free) to ping  
`https://skillbridge-api.onrender.com` every 10 minutes.
