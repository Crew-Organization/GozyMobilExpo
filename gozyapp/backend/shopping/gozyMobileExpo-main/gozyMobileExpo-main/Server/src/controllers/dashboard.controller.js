const { state } = require('../utils/store');

function getDashboardController(_req, res) {
  res.json(state.dashboard);
}

module.exports = { getDashboardController };
