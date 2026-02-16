const fs = require('fs');
const path = require('path');

const BASE_STORAGE_DIR = path.join(__dirname, '..', '..', 'storage', 'projects');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureProjectDirs(projectInstanceId) {
  ensureDir(BASE_STORAGE_DIR);

  const projectDir = path.join(BASE_STORAGE_DIR, String(projectInstanceId));
  const submissionsDir = path.join(projectDir, 'submissions');

  ensureDir(projectDir);
  ensureDir(submissionsDir);

  return {
    projectDir,
    submissionsDir
  };
}

function saveUploadedFilePath(projectInstanceId, taskId, userId, timestamp, originalFilename) {
  const { submissionsDir } = ensureProjectDirs(projectInstanceId);
  const submissionFolderName = `${taskId}_${userId}_${timestamp}`;
  const finalPath = path.join(submissionsDir, submissionFolderName, originalFilename);

  return finalPath;
}

module.exports = {
  ensureProjectDirs,
  saveUploadedFilePath
};
