const { getBootstrap } = require('../utils/store');

function getBootstrapController(_req, res) {
  res.json(getBootstrap());
}

module.exports = { getBootstrapController };
