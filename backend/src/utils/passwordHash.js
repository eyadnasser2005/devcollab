const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

function hashPassword(plainTextPassword) {
  return bcrypt.hashSync(plainTextPassword, SALT_ROUNDS);
}

function comparePassword(plainTextPassword, passwordHash) {
  return bcrypt.compareSync(plainTextPassword, passwordHash);
}

module.exports = {
  hashPassword,
  comparePassword
};
