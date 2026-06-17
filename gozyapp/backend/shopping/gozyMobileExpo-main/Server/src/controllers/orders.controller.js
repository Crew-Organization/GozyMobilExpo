const { z } = require('zod');

const {
  createCheckoutOrder,
  createEntertainmentBooking,
  createFoodOrder,
  createShoppingOrder,
  getLiveOrder,
} = require('../utils/store');

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        sourceId: z.string().min(1),
        kind: z.enum(['food', 'shopping']),
        title: z.string().min(1),
        subtitle: z.string().min(1),
        image: z.string().optional(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

const addressSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().min(1),
  etaHint: z.string().optional(),
});

const paymentMethodSchema = z.enum(['wallet', 'upi', 'card']);

const foodOrderSchema = z.object({
  restaurantId: z.string().min(1),
  items: checkoutSchema.shape.items,
  address: addressSchema,
  paymentMethod: paymentMethodSchema,
  instructions: z.string().optional(),
});

const shoppingOrderSchema = z.object({
  items: checkoutSchema.shape.items,
  address: addressSchema,
  paymentMethod: paymentMethodSchema,
});

const entertainmentOrderSchema = z.object({
  eventId: z.string().min(1),
  seats: z.array(z.string().min(1)).min(1),
  paymentMethod: paymentMethodSchema,
});

function checkoutController(req, res) {
  const payload = checkoutSchema.parse(req.body);
  const order = createCheckoutOrder(payload.items);
  res.status(201).json(order);
}

function createFoodOrderController(req, res) {
  const payload = foodOrderSchema.parse(req.body);
  const order = createFoodOrder(payload);

  if (!order) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  if (order.error) {
    return res.status(400).json({ message: order.error });
  }

  return res.status(201).json(order);
}

function createShoppingOrderController(req, res) {
  const payload = shoppingOrderSchema.parse(req.body);
  const order = createShoppingOrder(payload);

  if (order.error) {
    return res.status(400).json({ message: order.error });
  }

  return res.status(201).json(order);
}

function createEntertainmentBookingController(req, res) {
  const payload = entertainmentOrderSchema.parse(req.body);
  const order = createEntertainmentBooking(payload);

  if (!order) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (order.error) {
    return res.status(400).json({ message: order.error });
  }

  return res.status(201).json(order);
}

function getOrderTrackingController(req, res) {
  const order = getLiveOrder(req.params.orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.json(order);
}

module.exports = {
  checkoutController,
  createFoodOrderController,
  createShoppingOrderController,
  createEntertainmentBookingController,
  getOrderTrackingController,
};
