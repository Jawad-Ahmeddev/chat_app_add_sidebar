// controllers/messageController.js
const Message = require('../models/message');
const Chat = require('../models/chat');

exports.getMessages = async (req, res) => {
  const {chatId} = req.params;
  try {
    const messages = await Message.find({ chat: chatId }).populate('sender', 'username profilePicture');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages.' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, sender, message } = req.body;
    const newMessage = new Message({ chat: chatId, sender, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message.' });
  }
};
