const express = require('express');

const { getRestaurantsController } = require('../controllers/modules.controller');

const router = express.Router();

router.get('/restaurants', getRestaurantsController);

module.exports = router;
