function register(req, res) {
  return res.status(501).json({ error: "NOT_IMPLEMENTED", handler: "register" });
}

function login(req, res) {
  return res.status(501).json({ error: "NOT_IMPLEMENTED", handler: "login" });
}

module.exports = { register, login };
