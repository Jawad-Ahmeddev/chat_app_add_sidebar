const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    name: { type: String, default: '' },  // For group chats
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // List of participants
    type: { type: String, enum: ['personal', 'group'], default: 'personal' },  // Chat type
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
