const Room = require('../backend/models/room');
const express = require('express')
async function cleanUpParticipants() {
    try {
        let room = await Room.findOne({ name: 'Group Chat' });

        if (room) {
            // Filter out null values
            room.participants = room.participants.filter(participant => participant !== null);
            await room.save();
            console.log('Null values removed from participants array.');
        } else {
            console.log('Group Chat room not found.');
        }
    } catch (err) {
        console.error('Error during cleanup:', err);
    }
}

// Run the cleanup script
cleanUpParticipants();
