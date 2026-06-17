const express = require('express');

const { searchTravelController } = require('../controllers/travel.controller');
const { getTravelController } = require('../controllers/modules.controller');

const router = express.Router();

router.get('/', getTravelController);
router.post('/search', searchTravelController);

module.exports = router;
