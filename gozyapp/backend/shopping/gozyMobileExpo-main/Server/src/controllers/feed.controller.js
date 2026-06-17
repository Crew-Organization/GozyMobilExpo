const { z } = require('zod');

const { applySwipe, state } = require('../utils/store');

const swipeSchema = z.object({
  direction: z.enum(['left', 'right']),
});

function getFeedController(_req, res) {
  res.json(state.feed);
}

function swipeFeedController(req, res) {
  const payload = swipeSchema.parse(req.body);
  const experience = applySwipe(req.params.experienceId, payload.direction);

  if (!experience) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  return res.json({ success: true, experience });
}

module.exports = {
  getFeedController,
  swipeFeedController,
};
