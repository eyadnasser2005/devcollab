# DevCollab Runbook (Local MVP)

## 1) Prerequisites

- Node.js 18+ recommended
- npm

## 2) Configure Environment

### Backend

```bash
cd backend
cp .env.example .env
```

Expected backend `.env` values:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=dev_secret_change_me
```

### Frontend

```bash
cd frontend
cp .env.example .env
```

Expected frontend `.env` values:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## 3) Start Backend

```bash
cd backend
npm install
npm run dev
```

- API should be reachable at `http://localhost:3001`
- SQLite DB file appears at: `backend/devcollab.sqlite`

## 4) Start Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

- Frontend dev server usually runs at `http://localhost:5173`

## 5) Quick Manual API Test Plan (curl)

Set base URL:

```bash
BASE_URL=http://localhost:3001
```

### 5.1 Health

```bash
curl -i "$BASE_URL/health"
```

### 5.2 Register

```bash
curl -i -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"password123"}'
```

Save returned token into `TOKEN`.

### 5.3 Login

```bash
curl -i -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

### 5.4 Get Profile

```bash
curl -i "$BASE_URL/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### 5.5 Update Profile

```bash
curl -i -X PUT "$BASE_URL/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","skills":[{"skill":"React","level":"INTERMEDIATE"}]}'
```

### 5.6 Start Project

```bash
curl -i -X POST "$BASE_URL/projects/start" \
  -H "Authorization: Bearer $TOKEN"
```

Capture returned `taskId` and `projectInstanceId` from response.

### 5.7 Dashboard

```bash
curl -i "$BASE_URL/dashboard" \
  -H "Authorization: Bearer $TOKEN"
```

### 5.8 Upload Task File

Create a sample file and upload:

```bash
echo "demo submission" > /tmp/demo-submission.txt
curl -i -X POST "$BASE_URL/tasks/<taskId>/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/demo-submission.txt" \
  -F "notes=Initial MVP upload"
```

## 6) Verify Storage Side Effects

After successful upload, check created folders/files:

```bash
ls -la backend/storage/projects
find backend/storage/projects -maxdepth 5 -type f
```

Expected pattern:

- `backend/storage/projects/<projectInstanceId>/submissions/<taskId>_<userId>_<timestamp>/<filename>`

## 7) Common Issues

- **401 Unauthorized:** token missing/expired or malformed bearer header.
- **CORS problems:** frontend origin not allowed by backend CORS settings.
- **Wrong API URL:** frontend `VITE_API_BASE_URL` does not match backend port.
