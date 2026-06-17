const { z } = require('zod');

const { addMessage, state } = require('../utils/store');

const messageSchema = z.object({
  text: z.string().min(1),
});

function getConversationsController(_req, res) {
  res.json(state.conversations);
}

function sendMessageController(req, res) {
  const payload = messageSchema.parse(req.body);
  const result = addMessage(req.params.conversationId, 'user-gozy', payload.text);

  if (!result) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  return res.json({ success: true, message: result.message });
}

module.exports = {
  getConversationsController,
  sendMessageController,
};
