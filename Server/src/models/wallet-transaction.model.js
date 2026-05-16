const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    createdAt: String,
    status: String,
    type: String,
    category: String,
  },
  { timestamps: true },
);

module.exports = {
  WalletTransactionModel:
    mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', walletTransactionSchema),
};
