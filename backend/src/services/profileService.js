const db = require('../config/db');
const UserModel = require('../models/UserModel');
const UserSkillModel = require('../models/UserSkillModel');
const { isNonEmptyString, isValidSkillLevel } = require('../utils/validators');

function sanitizeSkills(skills) {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .filter((skill) => skill && isNonEmptyString(skill.tech_name) && isValidSkillLevel(skill.level))
    .map((skill) => ({
      tech_name: skill.tech_name.trim(),
      level: skill.level
    }));
}

function toPublicUser(userRow) {
  if (!userRow) {
    return null;
  }

  const { password_hash, ...safeUser } = userRow;
  return safeUser;
}

function getProfile(userId) {
  const user = UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const skills = UserSkillModel.getSkillsForUser(userId);

  return {
    user: toPublicUser(user),
    skills
  };
}

function updateProfile(userId, { skills, availability_hours_per_week, preferred_roles }) {
  const user = UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const normalizedSkills = sanitizeSkills(skills);
  UserSkillModel.replaceSkillsForUser(userId, normalizedSkills);

  const parsedAvailability = Number.isFinite(Number(availability_hours_per_week))
    ? Number(availability_hours_per_week)
    : 0;

  db.prepare('UPDATE users SET availability_hours_per_week = ? WHERE id = ?').run(parsedAvailability, userId);

  void preferred_roles;

  return getProfile(userId);
}

module.exports = {
  getProfile,
  updateProfile
};
