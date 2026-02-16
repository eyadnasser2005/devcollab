const path = require('path');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '..', '..', 'devcollab.sqlite');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  availability_hours_per_week INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tech_name TEXT NOT NULL,
  level TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS project_template_roles (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  role_name TEXT NOT NULL,
  required_skills_json TEXT NOT NULL,
  deliverables_json TEXT NOT NULL,
  FOREIGN KEY (template_id) REFERENCES project_templates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_instances (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (template_id) REFERENCES project_templates(id)
);

CREATE TABLE IF NOT EXISTS project_members (
  id TEXT PRIMARY KEY,
  project_instance_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  assigned_role TEXT NOT NULL,
  active_status TEXT NOT NULL,
  credit_eligible INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (project_instance_id) REFERENCES project_instances(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS role_tasks (
  id TEXT PRIMARY KEY,
  project_member_id TEXT NOT NULL,
  description TEXT NOT NULL,
  required_path TEXT NOT NULL,
  status TEXT NOT NULL,
  due_at TEXT,
  FOREIGN KEY (project_member_id) REFERENCES project_members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  role_task_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  file_path_on_disk TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  validation_status TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (role_task_id) REFERENCES role_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

const templateCount = db.prepare('SELECT COUNT(*) AS count FROM project_templates').get();

if (templateCount.count === 0) {
  const templateId = uuidv4();

  const insertTemplate = db.prepare(`
    INSERT INTO project_templates (id, title, description, tech_stack_json, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertRole = db.prepare(`
    INSERT INTO project_template_roles (id, template_id, role_name, required_skills_json, deliverables_json)
    VALUES (?, ?, ?, ?, ?)
  `);

  const seed = db.transaction(() => {
    insertTemplate.run(
      templateId,
      'DevCollab MVP Template',
      'Single-user deterministic starter template for MVP project flow.',
      JSON.stringify(['React', 'Node.js', 'Express', 'SQLite']),
      'ACTIVE'
    );

    const roles = [
      {
        roleName: 'FRONTEND_DEV',
        requiredSkills: ['React', 'JavaScript'],
        deliverables: [
          {
            description: 'Implement dashboard UI shell',
            required_path: 'frontend/src/pages/DashboardPage.jsx',
            accepts_file_types: ['.jsx', '.js', '.css']
          }
        ]
      },
      {
        roleName: 'BACKEND_DEV',
        requiredSkills: ['Node.js', 'Express', 'SQLite'],
        deliverables: [
          {
            description: 'Implement API controller logic',
            required_path: 'backend/src/controllers',
            accepts_file_types: ['.js']
          },
          {
            description: 'Ensure DB initialization works',
            required_path: 'backend/src/config/db.js',
            accepts_file_types: ['.js']
          }
        ]
      },
      {
        roleName: 'QA_TESTER',
        requiredSkills: ['Testing', 'API Validation'],
        deliverables: [
          {
            description: 'Provide endpoint verification report',
            required_path: 'docs/API_SPEC.md',
            accepts_file_types: ['.md', '.txt']
          }
        ]
      },
      {
        roleName: 'DEVOPS',
        requiredSkills: ['Docker', 'Deployment'],
        deliverables: [
          {
            description: 'Validate runtime environment configuration',
            required_path: 'infra/docker-compose.yml',
            accepts_file_types: ['.yml', '.yaml']
          }
        ]
      }
    ];

    roles.forEach((role) => {
      insertRole.run(
        uuidv4(),
        templateId,
        role.roleName,
        JSON.stringify(role.requiredSkills),
        JSON.stringify(role.deliverables)
      );
    });
  });

  seed();
}

module.exports = db;
