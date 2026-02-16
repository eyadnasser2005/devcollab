function startProject(req, res) {
  return res.status(501).json({ error: "NOT_IMPLEMENTED", handler: "startProject" });
}

function getDashboard(req, res) {
  return res.status(501).json({ error: "NOT_IMPLEMENTED", handler: "getDashboard" });
}

module.exports = { startProject, getDashboard };
