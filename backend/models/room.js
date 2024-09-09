const mongoose = require('mongoose');
const User = require('./User');

const roomSchema = new mongoose.Schema({
    name : {
        type: String, 
        default : '',
    },
    type: {
        type : String, 
        enum : ['personal', 'group']
    },
    participants : [{
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'User',
    }], 
    createdAt : {
        type : Date, 
        default: Date.now,
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Room', roomSchema)