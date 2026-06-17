const { z } = require('zod');

const { searchBusInventory, getBusSeatLayout } = require('../utils/bus-inventory');
const { getOperatorBusPhotos } = require('../utils/operator-bus-media');

const searchSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  date: z.string().min(1),
  scope: z.enum(['all', 'govt']).optional().default('all'),
  operatorId: z.string().optional(),
});

const seatsQuerySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  date: z.string().min(1),
  operator: z.string().optional(),
  isSleeper: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => value === 'true'),
});

const mediaQuerySchema = z.object({
  operator: z.string().min(1),
});

function searchBusesController(req, res) {
  const payload = searchSchema.parse(req.body);
  res.json(searchBusInventory(payload));
}

function getBusSeatsController(req, res) {
  const query = seatsQuerySchema.parse(req.query);
  res.json(
    getBusSeatLayout({
      busId: req.params.busId,
      from: query.from,
      to: query.to,
      date: query.date,
      isSleeper: query.isSleeper ?? false,
      operator: query.operator,
    }),
  );
}

function getBusMediaController(req, res) {
  const query = mediaQuerySchema.parse(req.query);
  res.json(getOperatorBusPhotos({ operator: query.operator, busId: req.params.busId }));
}

module.exports = {
  searchBusesController,
  getBusSeatsController,
  getBusMediaController,
};
