const express = require('express');

const { getConversationsController, sendMessageController } = require('../controllers/chat.controller');

const router = express.Router();

router.get('/', getConversationsController);
router.post('/:conversationId/messages', sendMessageController);

module.exports = router;
