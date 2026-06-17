const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    experienceId: String,
    title: String,
    category: String,
    location: String,
    date: String,
    guests: Number,
    total: Number,
    status: String,
  },
  { timestamps: true },
);

module.exports = {
  BookingModel: mongoose.models.Booking || mongoose.model('Booking', bookingSchema),
};
