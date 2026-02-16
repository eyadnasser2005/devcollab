const db = require('../config/db');

function createMember({ id, project_instance_id, user_id, assigned_role, active_status, credit_eligible }) {
  const stmt = db.prepare(
    `INSERT INTO project_members (id, project_instance_id, user_id, assigned_role, active_status, credit_eligible)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  stmt.run(id, project_instance_id, user_id, assigned_role, active_status, credit_eligible);
}

function getMembersForInstance(projectInstanceId) {
  const stmt = db.prepare(
    `SELECT *
     FROM project_members
     WHERE project_instance_id = ?
     ORDER BY rowid ASC`
  );

  return stmt.all(projectInstanceId);
}

function getMemberForUserInInstance(projectInstanceId, userId) {
  const stmt = db.prepare(
    `SELECT *
     FROM project_members
     WHERE project_instance_id = ? AND user_id = ?
     LIMIT 1`
  );

  return stmt.get(projectInstanceId, userId) || null;
}

function setCreditEligible(projectMemberId, creditEligibleInt) {
  const stmt = db.prepare(
    `UPDATE project_members
     SET credit_eligible = ?
     WHERE id = ?`
  );

  stmt.run(creditEligibleInt, projectMemberId);
}

module.exports = {
  createMember,
  getMembersForInstance,
  getMemberForUserInInstance,
  setCreditEligible
};
