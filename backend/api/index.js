const { app, ready } = require("../server");

module.exports = async (req, res) => {
  try {
    // Connects on the first invocation of a cold container, reused after.
    await ready();
  } catch (err) {
    console.error("Startup failed:", err.message);
    return res
      .status(503)
      .json({ error: "Service unavailable. Check server configuration." });
  }
  return app(req, res);
};
