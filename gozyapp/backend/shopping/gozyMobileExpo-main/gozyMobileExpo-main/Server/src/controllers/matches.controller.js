const { likeMatch, state } = require('../utils/store');

function getMatchesController(_req, res) {
  res.json(state.matches);
}

function likeMatchController(req, res) {
  const match = likeMatch(req.params.matchId);
  if (!match) {
    return res.status(404).json({ message: 'Match not found' });
  }

  return res.json({ success: true, match });
}

module.exports = {
  getMatchesController,
  likeMatchController,
};
