const { app, ready } = require("../server");

module.exports = async (req, res) => {
  // Connects on the first invocation of a cold container and reuses the
  // connection afterwards; see config/db.js.
  await ready();
  return app(req, res);
};
