const express = require('express');

const { getProductsController } = require('../controllers/modules.controller');

const router = express.Router();

router.get('/products', getProductsController);

module.exports = router;
