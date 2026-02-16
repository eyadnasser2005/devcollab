const db = require('../config/db');

function getActiveTemplate() {
  const stmt = db.prepare(
    `SELECT *
     FROM project_templates
     WHERE status = 'ACTIVE'
     ORDER BY rowid ASC
     LIMIT 1`
  );

  return stmt.get() || null;
}

function countTemplates() {
  const stmt = db.prepare('SELECT COUNT(*) AS count FROM project_templates');
  const row = stmt.get();
  return row.count;
}

module.exports = {
  getActiveTemplate,
  countTemplates
};
