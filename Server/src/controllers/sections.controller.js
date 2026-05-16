const { state } = require('../utils/store');

function getSectionsController(_req, res) {
  res.json(state.sections);
}

module.exports = { getSectionsController };
