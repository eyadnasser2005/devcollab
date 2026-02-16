const db = require('../config/db');

function createInstance({ id, template_id, status, created_at }) {
  const stmt = db.prepare(
    `INSERT INTO project_instances (id, template_id, status, created_at)
     VALUES (?, ?, ?, ?)`
  );

  stmt.run(id, template_id, status, created_at);
}

function setComplete(instanceId, completed_at) {
  const stmt = db.prepare(
    `UPDATE project_instances
     SET status = 'COMPLETE', completed_at = ?
     WHERE id = ?`
  );

  stmt.run(completed_at, instanceId);
}

function findById(instanceId) {
  const stmt = db.prepare('SELECT * FROM project_instances WHERE id = ?');
  return stmt.get(instanceId) || null;
}

module.exports = {
  createInstance,
  setComplete,
  findById
};
