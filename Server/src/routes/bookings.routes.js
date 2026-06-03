const express = require('express');

const {
  getBookingsController,
  createBookingController,
  createHotelBookingController,
  createTravelBookingController,
} = require('../controllers/bookings.controller');

const router = express.Router();

router.get('/', getBookingsController);
router.post('/', createBookingController);
router.post('/travel', createTravelBookingController);
router.post('/hotel', createHotelBookingController);

module.exports = router;
