const Room = require('../models/room');
const User = require('../models/User'); 
const Chat = require('../models/chat');

exports.createOrJoinPersonalChatByEmail = async (req, res) => {
    const { userEmail1, userEmail2 } = req.body;

    try {
        const user1 = await User.findOne({ email: userEmail1 });
        const user2 = await User.findOne({ email: userEmail2 });

        if (!user1 || !user2) {
            return res.status(404).json({ message: 'One or both users not found' });
        }

        // Check if a personal chat already exists between these users
        let room = await Room.findOne({
            type: 'personal',
            participants: { $all: [user1._id, user2._id], $size: 2 }
        });

        // If no room exists, create a new one
        if (!room) {
            room = new Room({
                type: 'personal',
                participants: [user1._id, user2._id],
                name: `${user1.username} & ${user2.username}`
            });
            await room.save();
        }

        // Check if a chat exists, otherwise create a chat
        let chat = await Chat.findOne({ room: room._id });
        if (!chat) {
            chat = new Chat({
                participants: [user1._id, user2._id],
                lastMessage: null,
                updatedAt: new Date()
            });
            await chat.save();
        }

        res.status(200).json({ message: 'Personal chat found or created successfully', room });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.getPersonalChats = async (req, res) => {
    const { userId } = req.body;

    try {
        const personalChats = await Room.find({
            type: 'personal',
            participants: userId
        }).populate('participants', 'username email profilePicture');

        res.status(200).json(personalChats);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getAllPrivateChats = async (req, res) => {
    const { userId } = req.body;
    try {
        const privateChats = await Room.find({ type: 'personal', participants: userId })
            .populate('participants', 'username profilePicture');
        res.status(200).json(privateChats);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getRecentChats = async (req, res) => {
    const { userId } = req.body;
    try {
        const recentChats = await Room.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate('participants', 'username profilePicture');

        res.status(200).json(recentChats);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getGroupChat = async (req, res) => {
    const { userId } = req.body;

    try {
        const groupChat = await Room.findOne({
            type: 'group',
            participants: userId
        }).populate('participants', 'username email profilePicture');

        if (!groupChat) {
            return res.status(404).json({ message: 'Group chat not found' });
        }

        const messages = await Chat.find({ room: groupChat._id })
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
            .exec();

        res.status(200).json({ groupChat, messages });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// roomController.js
exports.getRoomByParticipants = async (req, res) => {
    const { senderId, receiverId } = req.body;
  
    try {
      const room = await Room.findOne({
        participants: { $all: [senderId, receiverId] }
      });
  
      if (room) {
        return res.status(200).json(room);
      } else {
        return res.status(404).json({ message: 'Room not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching room', error });
    }
  };
  