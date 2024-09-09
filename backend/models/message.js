const mongoose = require ('mongoose');

const messagesSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required : true,
    },
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User', 
        required : true
    }, 
    message : {
        type : String, 
        required : true
    }, 
    createdAt : {
        type : Date, 
        default: Date.now,
    }
}, {
    timestamps : true,
})

module.exports = mongoose.model('Message', messagesSchema)