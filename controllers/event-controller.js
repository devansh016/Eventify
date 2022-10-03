const Event = require("../models/event-model.js");
const { v4: uuidv4 } = require('uuid');

async function createEvent ({ title, description, date}){
    try {
        // Create Event
        const event = new Event ({ "eventID": uuidv4(), title, description, date });
        await event.save();
        return { "status": 200, "message": "Event created."};
    } catch (error) {
        return { "status": 500, "message": error.message };
    }
}

async function getAllEvent () {
    try {
        // Get all events
        const event = await Event.find();
        return { "status": 200, "event": event };
    } catch (error) {
        return { "status": 500, "message": error.message };
    }
}

async function getEvent ({ eventID }){
    try {
        // Get event by eventID
        const event = await Event.findOne({ eventID });
        return { "status": 200, "event": event };
    } catch (error) {
        return { "status": 500, "message": error.message };
    }
}

async function deleteEvent ({ eventID }){
    try {
        // Check if event exists
        const event = await Event.findOne({ eventID });
        if(!event)
            return { "status": 404, "message": "Event not found." };
        // Delete Event
        await Event.deleteOne({ eventID });
        return { "status": 200, "message": "Event deleted." };
    } catch (error) {
        console.log(error);
        return { "status": 500, "message": error.message };
    }
}

module.exports = {
    createEvent,
    getAllEvent,
    getEvent,
    deleteEvent
}