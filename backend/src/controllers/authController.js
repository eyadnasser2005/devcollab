const authService = require('../services/authService');

function createHttpError(message, statusCode, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

function mapAuthError(error) {
  if (error.message === 'Invalid registration payload' || error.message === 'Invalid login payload') {
    return createHttpError(error.message, 400, 'VALIDATION_ERROR');
  }

  if (error.message === 'Email already in use') {
    return createHttpError(error.message, 400, 'EMAIL_IN_USE');
  }

  if (error.message === 'Invalid credentials') {
    return createHttpError(error.message, 401, 'INVALID_CREDENTIALS');
  }

  return error;
}

function register(req, res, next) {
  try {
    const result = authService.register(req.body || {});
    return res.status(201).json(result);
  } catch (error) {
    return next(mapAuthError(error));
  }
}

function login(req, res, next) {
  try {
    const result = authService.login(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return next(mapAuthError(error));
  }
}

module.exports = {
  register,
  login
};
