const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventID : {type: String, unique: true, required: true },
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
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