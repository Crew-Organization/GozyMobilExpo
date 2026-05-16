const express = require('express');

const { getMatchesController, likeMatchController } = require('../controllers/matches.controller');

const router = express.Router();

router.get('/', getMatchesController);
router.post('/:matchId/like', likeMatchController);

module.exports = router;
