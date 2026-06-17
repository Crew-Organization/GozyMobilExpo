const { markNotificationRead, state } = require('../utils/store');

function getNotificationsController(_req, res) {
  res.json(state.notifications);
}

function markNotificationReadController(req, res) {
  const notification = markNotificationRead(req.params.notificationId);
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.json({ success: true, notification });
}

module.exports = {
  getNotificationsController,
  markNotificationReadController,
};
