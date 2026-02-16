# DevCollab API Specification (MVP)

Base URL (local default): `http://localhost:3001`

## Auth Model

Protected endpoints require:

```
Authorization: Bearer <token>
```

JWT payload includes `{ userId }`.

---

## Public Endpoints

### GET /health

Health check endpoint.

**Request body:** none

**Response 200 (example):**

```json
{
  "status": "ok"
}
```

### POST /auth/register

Create a new user and return auth token.

**Request body (JSON):**

```json
{
  "name": "Jane Dev",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response 201 (example):**

```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Jane Dev",
    "email": "jane@example.com"
  }
}
```

### POST /auth/login

Authenticate existing user and return auth token.

**Request body (JSON):**

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response 200 (example):**

```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Jane Dev",
    "email": "jane@example.com"
  }
}
```

---

## Protected Endpoints

### GET /profile

Return the authenticated user profile and skills.

**Headers:** `Authorization: Bearer <token>`

**Response 200 (example):**

```json
{
  "user": {
    "id": 1,
    "name": "Jane Dev",
    "email": "jane@example.com"
  },
  "skills": [
    {
      "skill": "React",
      "level": "INTERMEDIATE"
    }
  ]
}
```

### PUT /profile

Replace profile skill set for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Request body (JSON example):**

```json
{
  "name": "Jane Dev",
  "skills": [
    {
      "skill": "React",
      "level": "INTERMEDIATE"
    },
    {
      "skill": "Node.js",
      "level": "BEGINNER"
    }
  ]
}
```

**Response 200 (example):**

```json
{
  "message": "Profile updated",
  "user": {
    "id": 1,
    "name": "Jane Dev",
    "email": "jane@example.com"
  },
  "skills": [
    {
      "skill": "React",
      "level": "INTERMEDIATE"
    },
    {
      "skill": "Node.js",
      "level": "BEGINNER"
    }
  ]
}
```

### POST /projects/start

Create a new project instance for the authenticated user and assign a predefined role/tasks.

**Headers:** `Authorization: Bearer <token>`

**Request body:** none

**Response 201 (example):**

```json
{
  "projectInstanceId": 10,
  "projectStatus": "ACTIVE",
  "assignedRole": "FRONTEND_DEV",
  "tasks": [
    {
      "taskId": 101,
      "title": "Build UI component",
      "status": "PENDING"
    }
  ]
}
```

### GET /dashboard

Return current user dashboard data including active and completed projects.

**Headers:** `Authorization: Bearer <token>`

**Response 200 (example):**

```json
{
  "activeProjects": [
    {
      "projectInstanceId": 10,
      "status": "ACTIVE"
    }
  ],
  "completedProjects": [
    {
      "projectInstanceId": 8,
      "status": "COMPLETE"
    }
  ]
}
```

### POST /tasks/:taskId/upload

Upload a task submission file. Uses `multipart/form-data`.

**Headers:** `Authorization: Bearer <token>`

**Path param:**
- `taskId` (required)

**Form fields:**
- `file` (required, file)
- `notes` (optional, text)

**Response 201 (example):**

```json
{
  "message": "Submission uploaded",
  "taskId": 101,
  "status": "APPROVED",
  "submission": {
    "id": 501,
    "filePath": "backend/storage/projects/10/submissions/101_1_1700000000000/output.zip",
    "notes": "Initial submission"
  }
}
```
