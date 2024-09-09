const Room = require('../models/room');
const Message = require('../models/message');
const User = require('../models/User');
const  chat = require('../models/chat')

module.exports = function (io){
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join the room using chatId
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User joined chat: ${chatId}`);
        });

        // Handle chat message
        socket.on('newMessage', (messageData) => {
            const { chatId, message } = messageData;
            // Emit the message to the correct chat room
            io.to(chatId).emit('message', message);
            console.log(`Message sent to chatId: ${chatId}`);
          });

        socket.on('disconnect', () => {
            console.log("User is disconnected");
        });
    });
};