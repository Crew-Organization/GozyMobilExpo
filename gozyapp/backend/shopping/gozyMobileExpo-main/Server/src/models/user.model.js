const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    avatar: String,
    city: String,
    interests: [String],
    budget: String,
    homeAirport: String,
    preferredCategories: [String],
  },
  { timestamps: true },
);

module.exports = {
  UserModel: mongoose.models.User || mongoose.model('User', userSchema),
};
