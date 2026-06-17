const { z } = require('zod');

const { searchTravelInventory } = require('../utils/store');

const travelSearchSchema = z.object({
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
});

function searchTravelController(req, res) {
  const payload = travelSearchSchema.parse(req.body);
  res.json(searchTravelInventory(payload));
}

module.exports = {
  searchTravelController,
};
