const express = require('express');

const { getEventsController } = require('../controllers/modules.controller');

const router = express.Router();

router.get('/events', getEventsController);

module.exports = router;
