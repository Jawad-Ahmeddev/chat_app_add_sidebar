const Room = require('../models/room');
const Message = require('../models/message');
const User = require('../models/User');
const  chat = require('../models/chat')

module.exports = function (io) {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  
      // Join the room using roomId
      socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
      });
  
      // Handle new message
      socket.on('message', async (messageData) => {
        const { chatId, message, sender } = messageData;
        try {
          const fullSender = await User.findById(sender._id).select('username profilePicture');
          const newMessage = new Message({
            chat: chatId,
            message,
            sender: fullSender._id,
          });
          await newMessage.save();
      
          const fullMessageData = {
            chatId,
            message,
            sender: {
              _id: fullSender._id,
              username: fullSender.username,
              profilePicture: fullSender.profilePicture,
            },
            createdAt: newMessage.createdAt,
          };
      
          // Emit the message to the chat room
          io.to(chatId).emit('message', fullMessageData);
          console.log('Message broadcasted to chat room:', chatId);
        } catch (error) {
          console.error('Error emitting message:', error);
        }
      });
      
  
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  };