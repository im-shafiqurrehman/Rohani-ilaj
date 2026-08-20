const jwt = require("jsonwebtoken");

function readToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

function verify(req) {
  const token = readToken(req);
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function requireUser(req, res, next) {
  const payload = verify(req);
  if (!payload) {
    return res.status(401).json({ error: "Login zaroori hai." });
  }
  req.user = payload;
  next();
}

function requireAdmin(req, res, next) {
  const payload = verify(req);
  if (!payload) {
    return res.status(401).json({ error: "Login required." });
  }
  if (payload.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  req.user = payload;
  req.admin = payload; // kept for older handlers that read req.admin
  next();
}

function optionalUser(req, res, next) {
  const payload = verify(req);
  if (payload) req.user = payload;
  next();
}

module.exports = { requireAdmin, requireUser, optionalUser };
