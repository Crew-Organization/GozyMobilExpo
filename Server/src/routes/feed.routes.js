const express = require('express');

const { getFeedController, swipeFeedController } = require('../controllers/feed.controller');

const router = express.Router();

router.get('/', getFeedController);
router.post('/:experienceId/swipe', swipeFeedController);

module.exports = router;
