const projectService = require('../services/projectService');

function createHttpError(message, statusCode, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

function mapProjectError(error) {
  if (error.message === 'No active template available' || error.message === 'Template role not found') {
    return createHttpError(error.message, 400, 'PROJECT_START_FAILED');
  }

  return error;
}

function startProject(req, res, next) {
  try {
    const result = projectService.startProject(req.user.id);
    return res.status(201).json(result);
  } catch (error) {
    return next(mapProjectError(error));
  }
}

function getDashboard(req, res, next) {
  try {
    const result = projectService.getDashboard(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  startProject,
  getDashboard
};
