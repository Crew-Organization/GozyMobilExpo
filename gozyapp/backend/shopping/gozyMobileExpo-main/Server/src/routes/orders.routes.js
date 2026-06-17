const express = require('express');

const {
  checkoutController,
  createEntertainmentBookingController,
  createFoodOrderController,
  createShoppingOrderController,
  getOrderTrackingController,
} = require('../controllers/orders.controller');

const router = express.Router();

router.post('/checkout', checkoutController);
router.post('/food', createFoodOrderController);
router.post('/shopping', createShoppingOrderController);
router.post('/entertainment', createEntertainmentBookingController);
router.get('/:orderId', getOrderTrackingController);

module.exports = router;
