const express = require('express');

const { getWalletController, addMoneyController } = require('../controllers/wallet.controller');

const router = express.Router();

router.get('/', getWalletController);
router.post('/add-money', addMoneyController);

module.exports = router;
