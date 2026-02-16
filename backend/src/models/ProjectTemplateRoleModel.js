const db = require('../config/db');

function getRolesForTemplate(templateId) {
  const stmt = db.prepare(
    `SELECT *
     FROM project_template_roles
     WHERE template_id = ?
     ORDER BY rowid ASC`
  );

  return stmt.all(templateId);
}

function getRoleForTemplate(templateId, roleName) {
  const stmt = db.prepare(
    `SELECT *
     FROM project_template_roles
     WHERE template_id = ? AND role_name = ?
     LIMIT 1`
  );

  return stmt.get(templateId, roleName) || null;
}

module.exports = {
  getRolesForTemplate,
  getRoleForTemplate
};
