# DevCollab Data Model (SQLite)

Database file: `backend/devcollab.sqlite`

The MVP uses the following SQLite tables.

## 1) `users`
Stores account identity and authentication attributes.

Typical data includes:
- primary key user id
- display name
- email (unique)
- password hash
- timestamps (created/updated)

## 2) `user_skills`
Stores user skill declarations used in profile setup.

Typical data includes:
- primary key id
- `user_id` reference to `users`
- skill name
- skill level

## 3) `project_templates`
Defines available predefined project templates.

Typical data includes:
- primary key template id
- template name/metadata

## 4) `project_template_roles`
Defines roles associated with each project template.

Typical data includes:
- primary key id
- `project_template_id` reference
- role code (e.g., `FRONTEND_DEV`, `BACKEND_DEV`, `QA_TESTER`, `DEVOPS`)

## 5) `project_instances`
Represents started project runs for users.

Typical data includes:
- primary key instance id
- `project_template_id` reference
- status (`FORMING`, `ACTIVE`, `COMPLETE`, `ABANDONED`)
- timestamps

## 6) `project_members`
Tracks membership/assignment of users into project instances and roles.

Typical data includes:
- primary key id
- `project_instance_id` reference
- `user_id` reference
- assigned role code

## 7) `role_tasks`
Stores task definitions and per-member task state within a project context.

Typical data includes:
- primary key task id
- role association
- title/description
- status (`PENDING`, `SUBMITTED`, `APPROVED`)

## 8) `submissions`
Stores uploaded submission metadata for tasks.

Typical data includes:
- primary key submission id
- `task_id` reference
- `user_id` reference
- stored file path
- optional notes
- timestamps

## Relationship Summary

- One `users` record can have many `user_skills`.
- One `project_templates` record can have many `project_template_roles`.
- One `project_instances` record can have many `project_members`.
- One project member role can map to many `role_tasks`.
- One `role_tasks` record can have one or more `submissions` over time.
