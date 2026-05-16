const express = require('express');

const {
  getBookingsController,
  createBookingController,
  createTravelBookingController,
} = require('../controllers/bookings.controller');

const router = express.Router();

router.get('/', getBookingsController);
router.post('/', createBookingController);
router.post('/travel', createTravelBookingController);

module.exports = router;
