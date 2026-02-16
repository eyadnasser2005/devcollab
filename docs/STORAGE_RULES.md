# DevCollab Storage Rules (MVP)

Task submission files are stored on local disk under backend storage.

## Base Path

`backend/storage/projects/`

## Directory Layout

For each uploaded submission:

`backend/storage/projects/<projectInstanceId>/submissions/<taskId>_<userId>_<timestamp>/<filename>`

Where:
- `<projectInstanceId>`: project instance identifier
- `<taskId>`: task identifier from route param
- `<userId>`: authenticated uploader user id
- `<timestamp>`: upload time marker (typically epoch milliseconds)
- `<filename>`: original uploaded file name (or multer-managed final name)

## What is Stored

- Raw uploaded artifact file from multipart field `file`
- Directory segmentation to keep uploads grouped by project and submission event
- Submission metadata in SQLite `submissions` table stores path and notes

## Operational Notes

- Directories are created on demand when an upload succeeds.
- Each upload gets an isolated timestamped folder to avoid filename collisions.
- Storage is local filesystem only for MVP; no cloud object storage integration.
