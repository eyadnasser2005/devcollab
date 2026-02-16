const db = require('../config/db');

function createUser({ id, name, email, password_hash, availability_hours_per_week, status, created_at }) {
  const stmt = db.prepare(
    `INSERT INTO users (id, name, email, password_hash, availability_hours_per_week, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  stmt.run(
    id,
    name,
    email,
    password_hash,
    availability_hours_per_week,
    status,
    created_at
  );
}

function findByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) || null;
}

function findById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) || null;
}

module.exports = {
  createUser,
  findByEmail,
  findById
};
