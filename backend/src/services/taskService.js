const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const projectStatus = require('../constants/projectStatus');
const taskStatus = require('../constants/taskStatus');
const RoleTaskModel = require('../models/RoleTaskModel');
const SubmissionModel = require('../models/SubmissionModel');
const ProjectMemberModel = require('../models/ProjectMemberModel');
const ProjectInstanceModel = require('../models/ProjectInstanceModel');

const TASK_APPROVED = taskStatus.APPROVED || 'APPROVED';
const PROJECT_COMPLETE = projectStatus.COMPLETE || 'COMPLETE';

function uploadTaskFile({ userId, taskId, fileInfo, notes }) {
  const task = RoleTaskModel.getTaskById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  const member = db
    .prepare('SELECT * FROM project_members WHERE id = ? AND user_id = ? LIMIT 1')
    .get(task.project_member_id, userId);

  if (!member) {
    throw new Error('Task does not belong to user');
  }

  const now = new Date().toISOString();
  const submission = {
    id: uuidv4(),
    role_task_id: taskId,
    user_id: userId,
    file_path_on_disk: fileInfo.path || fileInfo.file_path_on_disk || '',
    submitted_at: now,
    validation_status: 'PASSED',
    notes: notes || null
  };

  SubmissionModel.createSubmission(submission);

  RoleTaskModel.setTaskStatus(taskId, TASK_APPROVED);
  ProjectMemberModel.setCreditEligible(member.id, 1);

  const unapprovedCount = RoleTaskModel.countUnapprovedTasksForInstance(member.project_instance_id);
  let finalProjectStatus = null;

  if (unapprovedCount === 0) {
    ProjectInstanceModel.setComplete(member.project_instance_id, now);
    finalProjectStatus = PROJECT_COMPLETE;
  }

  return {
    submission_id: submission.id,
    task_id: taskId,
    task_status: TASK_APPROVED,
    project_instance_id: member.project_instance_id,
    project_status: finalProjectStatus,
    file_path_on_disk: submission.file_path_on_disk,
    submitted_at: now
  };
}

module.exports = {
  uploadTaskFile
};
