const express = require('express');

const authRoutes = require('./auth.routes');
const feedRoutes = require('./feed.routes');
const matchesRoutes = require('./matches.routes');
const chatRoutes = require('./chat.routes');
const walletRoutes = require('./wallet.routes');
const bookingsRoutes = require('./bookings.routes');
const dashboardRoutes = require('./dashboard.routes');
const notificationsRoutes = require('./notifications.routes');
const recommendationsRoutes = require('./recommendations.routes');
const sectionsRoutes = require('./sections.routes');
const travelRoutes = require('./travel.routes');
const foodRoutes = require('./food.routes');
const shoppingRoutes = require('./shopping.routes');
const entertainmentRoutes = require('./entertainment.routes');
const aiRoutes = require('./ai.routes');
const ordersRoutes = require('./orders.routes');
const busRoutes = require('./bus.routes');
const { getBootstrapController } = require('../controllers/bootstrap.controller');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gozy-server',
    date: new Date().toISOString(),
  });
});

router.get('/bootstrap', getBootstrapController);
router.use('/auth', authRoutes);
router.use('/feed', feedRoutes);
router.use('/matches', matchesRoutes);
router.use('/chat', chatRoutes);
router.use('/wallet', walletRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/sections', sectionsRoutes);
router.use('/travel', travelRoutes);
router.use('/food', foodRoutes);
router.use('/shopping', shoppingRoutes);
router.use('/entertainment', entertainmentRoutes);
router.use('/ai', aiRoutes);
router.use('/orders', ordersRoutes);
router.use('/bus', busRoutes);

module.exports = router;
