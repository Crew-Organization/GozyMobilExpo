const express = require('express');

const {
  getNotificationsController,
  markNotificationReadController,
} = require('../controllers/notifications.controller');

const router = express.Router();

router.get('/', getNotificationsController);
router.post('/:notificationId/read', markNotificationReadController);

module.exports = router;
