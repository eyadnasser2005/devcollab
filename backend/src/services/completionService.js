const projectService = require('./projectService');

function getDashboardForUser(userId) {
  return projectService.getDashboard(userId);
}

module.exports = {
  getDashboardForUser
};
