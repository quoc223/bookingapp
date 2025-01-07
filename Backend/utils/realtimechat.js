const { Server } = require('socket.io');
const Redis = require('ioredis');

function setupWebSocket(server) {
    const io = new Server(server);
    const redisSubscriber = new Redis();
    const redisPubClient = new Redis();

    // Redis subscriber for cross-instance message broadcasting
    redisSubscriber.on('message', (channel, message) => {
        const parsedMessage = JSON.parse(message);
        io.to(`chat:${parsedMessage.chat_id}`).emit('new_message', parsedMessage);
    });

    io.on('connection', (socket) => {
        // Join chat room
        socket.on('join_chat', (chatId) => {
            socket.join(`chat:${chatId}`);
        });

        // Leave chat room
        socket.on('leave_chat', (chatId) => {
            socket.leave(`chat:${chatId}`);
        });

        // Handle typing events
        socket.on('typing', (data) => {
            socket.to(`chat:${data.chatId}`).emit('typing', {
                userId: data.userId,
                isTyping: true
            });
        });

        // Handle stop typing events
        socket.on('stop_typing', (data) => {
            socket.to(`chat:${data.chatId}`).emit('typing', {
                userId: data.userId,
                isTyping: false
            });
        });
    });

    // Subscribe to Redis chat channels
    redisSubscriber.subscribe('chat:*');

    return io;
}

module.exports = setupWebSocket;
