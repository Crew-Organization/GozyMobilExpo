const express = require('express');

const { getSectionsController } = require('../controllers/sections.controller');

const router = express.Router();

router.get('/', getSectionsController);

module.exports = router;
