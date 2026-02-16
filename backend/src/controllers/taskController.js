const fs = require('fs');
const path = require('path');
const multer = require('multer');
const RoleTaskModel = require('../models/RoleTaskModel');
const db = require('../config/db');
const taskService = require('../services/taskService');
const { ensureProjectDirs } = require('../utils/fileStorage');

function createHttpError(message, statusCode, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

function buildUploadMiddleware(taskId, userId) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      try {
        const task = RoleTaskModel.getTaskById(taskId);
        if (!task) {
          return cb(createHttpError('Task not found', 404, 'TASK_NOT_FOUND'));
        }

        const member = db
          .prepare('SELECT * FROM project_members WHERE id = ? AND user_id = ? LIMIT 1')
          .get(task.project_member_id, userId);

        if (!member) {
          return cb(createHttpError('Task does not belong to user', 401, 'TASK_ACCESS_DENIED'));
        }

        const { submissionsDir } = ensureProjectDirs(member.project_instance_id);
        const timestamp = Date.now();
        const uploadDir = path.join(submissionsDir, `${taskId}_${userId}_${timestamp}`);

        fs.mkdirSync(uploadDir, { recursive: true });
        req.uploadContext = { projectInstanceId: member.project_instance_id };

        return cb(null, uploadDir);
      } catch (error) {
        return cb(error);
      }
    },
    filename(req, file, cb) {
      return cb(null, file.originalname);
    }
  });

  return multer({ storage }).single('file');
}

function mapTaskError(error) {
  if (error.message === 'Task not found') {
    return createHttpError(error.message, 404, 'TASK_NOT_FOUND');
  }

  if (error.message === 'Task does not belong to user') {
    return createHttpError(error.message, 401, 'TASK_ACCESS_DENIED');
  }

  return error;
}

function uploadTaskFile(req, res, next) {
  const userId = req.user.id;
  const taskId = req.params.taskId;
  const upload = buildUploadMiddleware(taskId, userId);

  upload(req, res, (uploadError) => {
    if (uploadError) {
      return next(mapTaskError(uploadError));
    }

    if (!req.file) {
      return next(createHttpError('No file uploaded', 400, 'FILE_REQUIRED'));
    }

    try {
      const result = taskService.uploadTaskFile({
        userId,
        taskId,
        fileInfo: req.file,
        notes: req.body ? req.body.notes : null
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(mapTaskError(error));
    }
  });
}

module.exports = {
  uploadTaskFile
};
