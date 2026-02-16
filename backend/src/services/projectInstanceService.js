const projectService = require('./projectService');

function startProjectForUser(userId) {
  return projectService.startProject(userId);
}

module.exports = {
  startProjectForUser
};
