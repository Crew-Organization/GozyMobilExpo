const { state } = require('../utils/store');

function getRecommendationsController(_req, res) {
  res.json({
    recommendations: state.recommendations,
  });
}

module.exports = { getRecommendationsController };
