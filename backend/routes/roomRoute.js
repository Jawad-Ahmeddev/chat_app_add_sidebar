const express = require('express')
const router = express.Router();

const {getRoomByParticipants,initGroupChat,joinGroupChat,createOrJoinPersonalChatByEmail, getGroupChat, getPersonalChats,getAllPrivateChats, getRecentChats} = require('../controllers/roomController');




// Route for fetching personal chats
router.post('/recent', getRecentChats);
router.post('/personal', getPersonalChats);
router.post('/private', getAllPrivateChats);
router.post('/createOrJoin', createOrJoinPersonalChatByEmail);
router.post('/group', getGroupChat);
router.post('/roomByParticipants', getRoomByParticipants);

module.exports = router;