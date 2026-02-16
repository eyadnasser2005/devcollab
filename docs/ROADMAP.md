# DevCollab Roadmap

## MVP (Current)

- User registration and login with JWT.
- Profile and skill setup.
- Deterministic project start and role assignment.
- Task file upload with submission tracking.
- Automatic project completion when all tasks are approved.
- Dashboard showing active and completed projects.

## Phase 2 (Planned)

### 1) Real Matchmaking

- Multi-user project grouping.
- Skill-aware role assignment.
- Fairness/queue logic for assignment quality.

### 2) GitHub Export

- Export project deliverables to GitHub repository structure.
- Optional branch/release packaging support.

### 3) Role Reassignment

- Reassign tasks/roles when users drop or mismatch occurs.
- Preserve audit trail for role changes.

### 4) Validation Jobs

- Async validation pipelines for submissions.
- Background checks (format/lint/test hooks) before approval.

### 5) Moderation

- Admin/moderator review tools for flagged submissions.
- Manual approval/rejection workflow and override actions.

## Out of Scope for MVP

- Advanced team optimization.
- Enterprise RBAC.
- External cloud storage and orchestration.
