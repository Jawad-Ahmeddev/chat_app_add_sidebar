const express= require('express')

const {getMessages,getChatById,sendMessage, getRecentChats, getAllPrivateChats} = require('../controllers/chatController')

const router = express.Router();



// Route for fetching messages in a room
router.post('/send', sendMessage);
router.get('/room/:roomId', getMessages);
// chatRoute.js
router.get('/:chatId', getChatById);

module.exports = router; 