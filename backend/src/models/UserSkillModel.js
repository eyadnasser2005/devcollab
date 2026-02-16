const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

function replaceSkillsForUser(userId, skills) {
  const deleteStmt = db.prepare('DELETE FROM user_skills WHERE user_id = ?');
  const insertStmt = db.prepare(
    `INSERT INTO user_skills (id, user_id, tech_name, level)
     VALUES (?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    deleteStmt.run(userId);

    for (const skill of skills) {
      insertStmt.run(uuidv4(), userId, skill.tech_name, skill.level);
    }
  });

  tx();
}

function getSkillsForUser(userId) {
  const stmt = db.prepare(
    `SELECT id, user_id, tech_name, level
     FROM user_skills
     WHERE user_id = ?
     ORDER BY tech_name ASC`
  );

  return stmt.all(userId);
}

module.exports = {
  replaceSkillsForUser,
  getSkillsForUser
};
