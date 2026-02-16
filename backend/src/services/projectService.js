const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const roles = require('../constants/roles');
const projectStatus = require('../constants/projectStatus');
const taskStatus = require('../constants/taskStatus');
const ProjectTemplateModel = require('../models/ProjectTemplateModel');
const ProjectTemplateRoleModel = require('../models/ProjectTemplateRoleModel');
const ProjectInstanceModel = require('../models/ProjectInstanceModel');
const ProjectMemberModel = require('../models/ProjectMemberModel');
const RoleTaskModel = require('../models/RoleTaskModel');
const UserSkillModel = require('../models/UserSkillModel');

const ROLE_FRONTEND_DEV = roles.FRONTEND_DEV || 'FRONTEND_DEV';
const ROLE_BACKEND_DEV = roles.BACKEND_DEV || 'BACKEND_DEV';
const PROJECT_ACTIVE = projectStatus.ACTIVE || 'ACTIVE';
const PROJECT_COMPLETE = projectStatus.COMPLETE || 'COMPLETE';
const TASK_PENDING = taskStatus.PENDING || 'PENDING';
const TASK_APPROVED = taskStatus.APPROVED || 'APPROVED';

function chooseRoleForUser(userSkills) {
  const hasReactIntermediate = userSkills.some(
    (skill) => skill.tech_name.toLowerCase() === 'react' && skill.level === 'INTERMEDIATE'
  );
  const hasNode = userSkills.some((skill) => skill.tech_name.toLowerCase().includes('node'));

  if (hasReactIntermediate && !hasNode) {
    return ROLE_FRONTEND_DEV;
  }

  return ROLE_BACKEND_DEV;
}

function parseDeliverables(deliverablesJson) {
  try {
    const parsed = JSON.parse(deliverablesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function startProject(userId) {
  const template = ProjectTemplateModel.getActiveTemplate();

  if (!template) {
    throw new Error('No active template available');
  }

  const now = new Date().toISOString();
  const projectInstanceId = uuidv4();

  ProjectInstanceModel.createInstance({
    id: projectInstanceId,
    template_id: template.id,
    status: PROJECT_ACTIVE,
    created_at: now
  });

  const skills = UserSkillModel.getSkillsForUser(userId);
  let assignedRole = chooseRoleForUser(skills);

  let templateRole = ProjectTemplateRoleModel.getRoleForTemplate(template.id, assignedRole);
  if (!templateRole) {
    assignedRole = ROLE_BACKEND_DEV;
    templateRole = ProjectTemplateRoleModel.getRoleForTemplate(template.id, assignedRole);
  }

  if (!templateRole) {
    throw new Error('Template role not found');
  }

  const memberId = uuidv4();
  ProjectMemberModel.createMember({
    id: memberId,
    project_instance_id: projectInstanceId,
    user_id: userId,
    assigned_role: assignedRole,
    active_status: PROJECT_ACTIVE,
    credit_eligible: 0
  });

  const deliverables = parseDeliverables(templateRole.deliverables_json);
  const createdTasks = deliverables.map((deliverable) => {
    const task = {
      id: uuidv4(),
      project_member_id: memberId,
      description: deliverable.description,
      required_path: deliverable.required_path,
      status: TASK_PENDING,
      due_at: null
    };

    RoleTaskModel.createTask(task);

    return {
      task_id: task.id,
      description: task.description,
      required_path: task.required_path,
      status: task.status,
      accepts_file_types: deliverable.accepts_file_types || []
    };
  });

  return {
    project_instance_id: projectInstanceId,
    project_title: template.title,
    status: PROJECT_ACTIVE,
    team: [
      {
        user_id: userId,
        assigned_role: assignedRole
      }
    ],
    your_tasks: createdTasks
  };
}

function getDashboard(userId) {
  const memberships = db
    .prepare(
      `SELECT pm.id AS project_member_id, pm.assigned_role, pi.id AS project_instance_id, pi.status, pi.created_at, pi.completed_at,
              pt.title AS project_title
       FROM project_members pm
       INNER JOIN project_instances pi ON pi.id = pm.project_instance_id
       INNER JOIN project_templates pt ON pt.id = pi.template_id
       WHERE pm.user_id = ?
       ORDER BY pi.created_at DESC`
    )
    .all(userId);

  const projects = memberships.map((membership) => {
    const counts = db
      .prepare(
        `SELECT
          COUNT(*) AS total_tasks,
          SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS approved_tasks
         FROM role_tasks rt
         INNER JOIN project_members pm ON pm.id = rt.project_member_id
         WHERE pm.project_instance_id = ?`
      )
      .get(TASK_APPROVED, membership.project_instance_id);

    const totalTasks = Number(counts.total_tasks || 0);
    const approvedTasks = Number(counts.approved_tasks || 0);
    const progressPercent = totalTasks === 0 ? 0 : Math.round((approvedTasks / totalTasks) * 100);

    return {
      project_instance_id: membership.project_instance_id,
      project_title: membership.project_title,
      status: membership.status,
      assigned_role: membership.assigned_role,
      progress_percent: progressPercent,
      created_at: membership.created_at,
      completed_at: membership.completed_at
    };
  });

  const outstandingTasks = db
    .prepare(
      `SELECT rt.id AS task_id, rt.description, rt.required_path, rt.status, pm.project_instance_id
       FROM role_tasks rt
       INNER JOIN project_members pm ON pm.id = rt.project_member_id
       WHERE pm.user_id = ?
         AND rt.status != ?
       ORDER BY rt.rowid ASC`
    )
    .all(userId, TASK_APPROVED);

  return {
    active_projects: projects.filter((project) => project.status === PROJECT_ACTIVE),
    completed_projects: projects.filter((project) => project.status === PROJECT_COMPLETE),
    outstanding_tasks: outstandingTasks
  };
}

module.exports = {
  startProject,
  getDashboard
};
