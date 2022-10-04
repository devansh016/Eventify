const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventID : {
        type: String,
        unique: true, 
        required: [true, 'Please provide an event Id']
    },
    title: { 
        type: String, 
        unique: true, 
        required: [true, 'Please provide a title for an event'],
        trim: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z ]*$/.test(value);
            },
            message: 'An event title should contain only alphabets',
        },
    },
    description: { 
        type: String,
        trim: true,
        required: [true, 'Please provide a description for an event'],
    },
    date: {
        type: Date, 
        required: [true, 'Please provide date for an event']
    },
    createdDate: { type: Date, default: Date.now }
});

eventSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.id;
    }
});

module.exports = mongoose.model('Event', eventSchema);
