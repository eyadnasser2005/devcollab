# DevCollab Completion Rules (MVP)

## Core Rule

A project instance becomes **COMPLETE** when **all tasks in that instance are approved**.

## Task State Model

Allowed task statuses:

- `PENDING`
- `SUBMITTED`
- `APPROVED`

## MVP Submission Behavior

For MVP, when the assigned user uploads via `POST /tasks/:taskId/upload`:

1. Submission metadata is recorded.
2. File is stored under the project submission storage path.
3. The task is marked approved immediately (MVP simplification).

## Project Status Model

Allowed project statuses:

- `FORMING`
- `ACTIVE`
- `COMPLETE`
- `ABANDONED`

## Completion Evaluation

After each successful upload/approval event, backend checks remaining tasks for the project instance:

- If at least one task is not approved, project remains active.
- If zero tasks remain unapproved, project status is updated to `COMPLETE`.

## Dashboard Effect

Once marked `COMPLETE`, that project appears in completed project listings; otherwise it appears in active listings.

## MVP Constraints

- No human review queue required before approval.
- No partial completion scoring.
- No weighted milestone logic.
- No cross-project dependency checks.
