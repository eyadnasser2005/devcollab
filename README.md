# DevCollab

DevCollab is an MVP web application where users register and log in, define their technical skills, get assigned to a predefined project template with a specific role and tasks, upload task submissions, and track project progress until completion when all assigned tasks are approved.

## Tech Stack

- **Frontend:** React (Vite), JavaScript, React Router, `fetch` API
- **Backend:** Node.js, Express, CommonJS, JWT auth, bcryptjs, multer
- **Database:** SQLite (`backend/devcollab.sqlite`)

## Folder Overview

- `backend/` — Express API, auth, project/task logic, SQLite integration
- `frontend/` — React Vite app for auth, profile setup, dashboard, and task uploads
- `docs/` — architecture, API, data model, and MVP behavior documentation
- `storage/` — uploaded project task files (`storage/projects/...`)

## Local Run (Primary, No Docker)

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

- Backend runs on `http://localhost:3001` (default)
- SQLite DB file is auto-created at `backend/devcollab.sqlite` when needed

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Set frontend environment variable in `frontend/.env` (or equivalent):

```env
VITE_API_BASE_URL=http://localhost:3001
```

Frontend dev server typically runs on `http://localhost:5173`.

## API Endpoints (MVP Only)

### Public

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`

### Protected (JWT Bearer Token Required)

- `GET /profile`
- `PUT /profile`
- `POST /projects/start`
- `GET /dashboard`
- `POST /tasks/:taskId/upload`

## Troubleshooting

- **Port mismatch:** Ensure backend is on `3001` and frontend `VITE_API_BASE_URL` points to `http://localhost:3001`.
- **Token issues:** Verify `Authorization: Bearer <token>` is sent for protected endpoints and frontend stores token in `localStorage` under `auth_token`.
- **CORS errors:** Confirm backend CORS config allows requests from frontend dev origin (e.g., `http://localhost:5173`).
