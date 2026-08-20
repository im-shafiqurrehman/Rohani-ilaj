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

/**
 * Any signed-in account.
 */
function requireUser(req, res, next) {
  const payload = verify(req);
  if (!payload) {
    return res.status(401).json({ error: "Login zaroori hai." });
  }
  req.user = payload;
  next();
}

/**
 * Admin-only routes.
 *
 * Authorisation is the `role` claim, not a separate token type — so promoting
 * someone in the database is all it takes to grant access, and demoting them
 * revokes it as soon as their current token expires.
 */
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

/**
 * Attaches req.user when a valid token is present, but never blocks. Used on
 * the public booking route so a signed-in customer's booking gets linked to
 * their account while guests still book freely.
 */
function optionalUser(req, res, next) {
  const payload = verify(req);
  if (payload) req.user = payload;
  next();
}

module.exports = { requireAdmin, requireUser, optionalUser };
