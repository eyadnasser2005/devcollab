# DevCollab Architecture (MVP)

DevCollab is a two-tier web application with file-based persistence support for uploads:

- **Frontend (`frontend/`)**: React + Vite single-page app for authentication, profile setup, project lifecycle actions, task submission, and dashboard viewing.
- **Backend (`backend/`)**: Node.js + Express API using CommonJS modules. Exposes public and JWT-protected routes.
- **Database (`backend/devcollab.sqlite`)**: SQLite database accessed by backend models/services.
- **File storage (`backend/storage/projects/`)**: Local filesystem storage for uploaded task submission files.

## Authentication

- Protected endpoints require `Authorization: Bearer <token>`.
- JWT payload includes `userId`.
- Token lifetime is 7 days.
- Frontend stores token under `localStorage` key `auth_token`.

## MVP Request Flow

1. **Register/Login**
   - User creates account (`POST /auth/register`) or signs in (`POST /auth/login`) and receives JWT.
2. **Profile Setup**
   - User reads and updates profile/skills (`GET /profile`, `PUT /profile`).
3. **Start Project**
   - User starts a project instance (`POST /projects/start`), is assigned to a predefined template role/tasks.
4. **Upload Task Submission**
   - User uploads task artifact (`POST /tasks/:taskId/upload`) using multipart form-data.
5. **Dashboard Tracking**
   - User views active/completed projects in dashboard (`GET /dashboard`).

## Runtime Boundaries

- Frontend communicates with backend over HTTP using `fetch`.
- Backend handles auth, validation, persistence, assignment, submission tracking, and completion checks.
- SQLite and filesystem storage are local runtime dependencies; no external DB/object storage in MVP.
