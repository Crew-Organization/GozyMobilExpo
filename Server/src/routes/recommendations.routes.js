const express = require('express');

const { getRecommendationsController } = require('../controllers/recommendations.controller');

const router = express.Router();

router.get('/', getRecommendationsController);

module.exports = router;
