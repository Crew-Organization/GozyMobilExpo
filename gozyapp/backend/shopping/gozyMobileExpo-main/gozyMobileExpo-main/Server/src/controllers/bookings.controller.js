const { z } = require('zod');

const { createBookingFromExperience, createTravelBooking, state } = require('../utils/store');

const bookingSchema = z.object({
  experienceId: z.string().min(1),
});

const travelBookingSchema = z.object({
  search: z.object({
    module: z.enum(['Flights', 'Hotels', 'Packages', 'Bus']),
    tripType: z.enum(['one-way', 'round-trip']),
    originCity: z.string().min(1),
    originCode: z.string().min(3),
    destinationCity: z.string().min(1),
    destinationCode: z.string().min(3),
    departureDate: z.string().min(1),
    returnDate: z.string().optional(),
    travellers: z.number().int().min(1).max(6),
    cabinClass: z.enum(['Economy', 'Premium Economy', 'Business']),
    nonStop: z.boolean(),
  }),
  offerId: z.string().min(1),
  travelers: z
    .array(
      z.object({
        fullName: z.string().min(1),
        age: z.string().min(1),
        gender: z.enum(['Male', 'Female', 'Other']),
      }),
    )
    .min(1),
  contact: z.object({
    phone: z.string().min(10),
    email: z.string().email(),
  }),
  addOnIds: z.array(z.string()),
  paymentMethod: z.enum(['wallet', 'upi', 'card']),
});

function getBookingsController(_req, res) {
  res.json(state.bookings);
}

function createBookingController(req, res) {
  const payload = bookingSchema.parse(req.body);
  const booking = createBookingFromExperience(payload.experienceId);
  if (!booking) {
    return res.status(404).json({ message: 'Experience not found' });
  }

  return res.status(201).json(booking);
}

function createTravelBookingController(req, res) {
  const payload = travelBookingSchema.parse(req.body);
  const booking = createTravelBooking(payload);

  if (!booking) {
    return res.status(404).json({ message: 'Travel offer not found' });
  }

  if (booking.error) {
    return res.status(400).json({ message: booking.error });
  }

  return res.status(201).json(booking);
}

module.exports = {
  getBookingsController,
  createBookingController,
  createTravelBookingController,
};
