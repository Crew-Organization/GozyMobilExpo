const { z } = require('zod');

const { addWalletFunds, state } = require('../utils/store');

const addMoneySchema = z.object({
  amount: z.number().positive(),
});

function getWalletController(_req, res) {
  res.json({
    balance: state.walletBalance,
    transactions: state.transactions,
  });
}

function addMoneyController(req, res) {
  const payload = addMoneySchema.parse(req.body);
  const balance = addWalletFunds(payload.amount);
  state.walletBalance = balance;
  res.json({ success: true, balance });
}

module.exports = {
  getWalletController,
  addMoneyController,
};
