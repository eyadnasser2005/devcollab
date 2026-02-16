const db = require('../config/db');

function createSubmission({ id, role_task_id, user_id, file_path_on_disk, submitted_at, validation_status, notes }) {
  const stmt = db.prepare(
    `INSERT INTO submissions (id, role_task_id, user_id, file_path_on_disk, submitted_at, validation_status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  stmt.run(id, role_task_id, user_id, file_path_on_disk, submitted_at, validation_status, notes || null);
}

function getLatestSubmissionForTask(taskId) {
  const stmt = db.prepare(
    `SELECT *
     FROM submissions
     WHERE role_task_id = ?
     ORDER BY submitted_at DESC
     LIMIT 1`
  );

  return stmt.get(taskId) || null;
}

module.exports = {
  createSubmission,
  getLatestSubmissionForTask
};
