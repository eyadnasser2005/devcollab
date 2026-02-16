module.exports = function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  req.user = { id: "stub_user" };

  return next();
};
