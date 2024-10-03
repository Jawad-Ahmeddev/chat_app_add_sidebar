const Message = require('../models/message');
const User = require('../models/User');
const  Chat = require('../models/chat')

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
      
          const chat = await Chat.findById(chatId);
          if (!chat) {
            return console.error(`Chat not found: ${chatId}`);
          }

          chat.lastMessage = newMessage._id;

          // Save the updated chat
          await chat.save();
  
          console.log('Updated chat with lastMessage:', chat);
  
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
              console.log('Emitting new message to chat room:', chatId, fullMessageData);

        } catch (error) {
          console.error('Error emitting message:', error);
        }
      });

      
      
  
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  };