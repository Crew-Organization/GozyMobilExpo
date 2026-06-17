const { z } = require('zod');

const { getAssistantReply } = require('../services/assistant.service');
const { recordAssistantExchange, state } = require('../utils/store');

const promptSchema = z.object({
  prompt: z.string().trim().min(1),
});

async function askAssistantController(req, res) {
  const payload = promptSchema.parse(req.body);
  const response = await getAssistantReply(payload.prompt);
  recordAssistantExchange(payload.prompt, response);
  res.json(response);
}

function getAssistantMessagesController(_req, res) {
  res.json(state.assistantMessages);
}

module.exports = {
  askAssistantController,
  getAssistantMessagesController,
};
