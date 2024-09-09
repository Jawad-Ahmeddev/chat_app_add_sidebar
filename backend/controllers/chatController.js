const Message = require('../models/message');
const Room = require('../models/room');
const Chat = require('../models/chat');
const User = require('../models/User');

// Sending a message

// chatController.js
exports.sendMessage = async (req, res) => {
    const { roomId, message, sender } = req.body;
  
    console.log('Received message payload:', { roomId, message, sender });  // Add this log
  
    try {
      const newMessage = new Message({
        room: roomId,
        sender,  
        message
      });
  
      await newMessage.save();
  
      res.status(200).json(newMessage);
    } catch (err) {
      console.error('Error saving message:', err);  // Add this log
      res.status(500).json({ message: 'Error saving message', error: err.message });
    }
};

  

// Fetching messages for a room
exports.getMessages = async (req, res) => {
    const { roomId } = req.params;

    try {
        const messages = await Message.find({ room: roomId })
            .populate('sender', 'username email profilePicture')
            .sort({ createdAt: 1 });

        if (!messages) {
            return res.status(404).json({ message: 'No messages found for this room' });
        }

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getChatById = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching chat', error });
  }
};
