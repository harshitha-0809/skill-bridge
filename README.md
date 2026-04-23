What it does
For Employees:

Browse and enroll in learning programs
Track progress with a visual slider (0–100%)
Personal dashboard with stats and recommendations

For Managers / HR:

Org-wide analytics dashboard with charts
Department breakdown — enrollments, completions, avg progress
Employee list with drill-down into individual programs
Create, edit, and delete programs in the catalog


Project Structure
skillbridge/
├── frontend/                  # React app (deployed to Vercel)
│   └── src/
│       ├── pages/             # Login, Dashboard, Programs, Progress, Org, Employees
│       ├── components/shared/ # UI component library
│       ├── api/               # Axios client + service functions
│       ├── context/           # Auth state (React Context)
│       └── hooks/             # useFetch, useAsync
├── backend/                   # FastAPI app (deployed to Render)
│   └── app/
│       ├── api/routes/        # auth, programs, enrollments, employees, analytics
│       ├── models/            # SQLAlchemy models (User, Program, Enrollment)
│       ├── schemas/           # Pydantic request/response schemas
│       └── core/              # Config, database, JWT security
├── render.yaml                # Render deploy blueprint
└── DEPLOY.md                  # Step-by-step deployment guide
