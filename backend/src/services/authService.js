const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/UserModel');
const { hashPassword, comparePassword } = require('../utils/passwordHash');
const { signToken } = require('../utils/jwt');
const { isValidEmail, isNonEmptyString } = require('../utils/validators');

function toPublicUser(userRow) {
  if (!userRow) {
    return null;
  }

  const { password_hash, ...safeUser } = userRow;
  return safeUser;
}

function register({ name, email, password }) {
  if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(password)) {
    throw new Error('Invalid registration payload');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = UserModel.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = {
    id: uuidv4(),
    name: name.trim(),
    email: normalizedEmail,
    password_hash: hashPassword(password),
    availability_hours_per_week: 0,
    status: 'ACTIVE',
    created_at: new Date().toISOString()
  };

  UserModel.createUser(user);

  const createdUser = UserModel.findById(user.id);
  const token = signToken({ userId: user.id });

  return {
    user: toPublicUser(createdUser),
    token
  };
}

function login({ email, password }) {
  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    throw new Error('Invalid login payload');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = UserModel.findByEmail(normalizedEmail);

  if (!user || !comparePassword(password, user.password_hash)) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ userId: user.id });

  return {
    user: toPublicUser(user),
    token
  };
}

module.exports = {
  register,
  login
};
