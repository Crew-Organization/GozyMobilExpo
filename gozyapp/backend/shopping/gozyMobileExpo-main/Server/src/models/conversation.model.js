const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: String,
    text: String,
    kind: String,
    createdAt: String,
  },
  { _id: false },
);

const conversationSchema = new mongoose.Schema(
  {
    participantName: String,
    participantId: String,
    avatar: String,
    online: Boolean,
    typing: Boolean,
    lastActive: String,
    destination: String,
    unreadCount: Number,
    lastMessage: String,
    messages: [messageSchema],
  },
  { timestamps: true },
);

module.exports = {
  ConversationModel:
    mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema),
};
