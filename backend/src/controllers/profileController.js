const profileService = require('../services/profileService');

function createHttpError(message, statusCode, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

function mapProfileError(error) {
  if (error.message === 'User not found') {
    return createHttpError(error.message, 404, 'USER_NOT_FOUND');
  }

  return error;
}

function getProfile(req, res, next) {
  try {
    const result = profileService.getProfile(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(mapProfileError(error));
  }
}

function updateProfile(req, res, next) {
  try {
    const result = profileService.updateProfile(req.user.id, req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return next(mapProfileError(error));
  }
}

module.exports = {
  getProfile,
  updateProfile
};
