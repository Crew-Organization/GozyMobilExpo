const express = require('express');

const {
  askAssistantController,
  getAssistantMessagesController,
} = require('../controllers/ai.controller');

const router = express.Router();

router.get('/messages', getAssistantMessagesController);
router.post('/assistant', askAssistantController);

module.exports = router;
