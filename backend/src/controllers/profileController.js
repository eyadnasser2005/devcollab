function getProfile(req, res) {
  return res.status(501).json({ error: "NOT_IMPLEMENTED", handler: "getProfile" });
}

function updateProfile(req, res) {
  return res.status(501).json({ error: "NOT_IMPLEMENTED", handler: "updateProfile" });
}

module.exports = { getProfile, updateProfile };
