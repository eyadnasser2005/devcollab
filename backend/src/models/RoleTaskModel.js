const db = require('../config/db');

function createTask({ id, project_member_id, description, required_path, status, due_at }) {
  const stmt = db.prepare(
    `INSERT INTO role_tasks (id, project_member_id, description, required_path, status, due_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  stmt.run(id, project_member_id, description, required_path, status, due_at || null);
}

function getTasksForMember(projectMemberId) {
  const stmt = db.prepare(
    `SELECT *
     FROM role_tasks
     WHERE project_member_id = ?
     ORDER BY rowid ASC`
  );

  return stmt.all(projectMemberId);
}

function getTaskById(taskId) {
  const stmt = db.prepare('SELECT * FROM role_tasks WHERE id = ?');
  return stmt.get(taskId) || null;
}

function setTaskStatus(taskId, status) {
  const stmt = db.prepare(
    `UPDATE role_tasks
     SET status = ?
     WHERE id = ?`
  );

  stmt.run(status, taskId);
}

function countUnapprovedTasksForInstance(projectInstanceId) {
  const stmt = db.prepare(
    `SELECT COUNT(*) AS count
     FROM role_tasks rt
     INNER JOIN project_members pm ON pm.id = rt.project_member_id
     WHERE pm.project_instance_id = ?
       AND rt.status != 'APPROVED'`
  );

  const row = stmt.get(projectInstanceId);
  return row.count;
}

module.exports = {
  createTask,
  getTasksForMember,
  getTaskById,
  setTaskStatus,
  countUnapprovedTasksForInstance
};
