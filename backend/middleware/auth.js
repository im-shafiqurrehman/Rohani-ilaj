const jwt = require("jsonwebtoken");

// Protects any route it's attached to - requires a valid admin JWT
// in the Authorization header: "Bearer <token>"
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Login required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired, please log in again." });
  }
}

module.exports = { requireAdmin };
