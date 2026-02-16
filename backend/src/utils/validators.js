const VALID_SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

function isValidEmail(value) {
  if (typeof value !== 'string') {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidSkillLevel(value) {
  return typeof value === 'string' && VALID_SKILL_LEVELS.includes(value);
}

module.exports = {
  isValidEmail,
  isNonEmptyString,
  isValidSkillLevel
};
