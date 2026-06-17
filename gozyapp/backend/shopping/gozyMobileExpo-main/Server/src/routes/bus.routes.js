const express = require('express');

const {
  getBusMediaController,
  getBusSeatsController,
  searchBusesController,
} = require('../controllers/bus.controller');

const router = express.Router();

router.post('/search', searchBusesController);
router.get('/:busId/media', getBusMediaController);
router.get('/:busId/seats', getBusSeatsController);

module.exports = router;
