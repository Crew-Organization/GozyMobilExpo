const { Server } = require('socket.io');

const { addMessage, state } = require('../utils/store');

function attachSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('user:join', ({ userId }) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on('chat:send', ({ conversationId, senderId, text }) => {
      const result = addMessage(conversationId, senderId, text);
      if (!result) {
        return;
      }

      const participantId = result.conversation.participantId;
      const senderName = state.session.user.name || 'Gozy traveler';

      io.to(`user:${participantId}`).emit('chat:new', {
        conversationId,
        message: text,
        senderName,
      });
    });
  });

  return io;
}

module.exports = { attachSocket };
