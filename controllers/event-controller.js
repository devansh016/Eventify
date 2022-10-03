const Event = require("../models/event-Model.js");
const { v4: uuidv4 } = require('uuid');

const createEvent = async ({ title, description, date}) => {
    try {
        // Create Event
        const event = new Event ({ "eventID": uuidv4(), title, description, date });
        await event.save();
        return { "status": 200, "message": "Event created."};
    } catch (error) {
        return { "status": 500, "message": error.message };
    }
}

const getAllEvent = async () => {
    try {
        // Get all events
        const event = await Event.find();
        return { "status": 200, "event": event };
    } catch (error) {
        return { "status": 500, "message": error.message };
    }
}

const getEvent = async  ({ eventID }) => {
    try {
        // Get event by eventID
        const event = await Event.findOne({ eventID });
        return { "status": 200, "event": event };
    } catch (error) {
        return { "status": 500, "message": error.message };
    }
}

const deleteEvent = async  ({ eventID }) => {
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
