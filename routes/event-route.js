const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event-controller.js")

router.post("/", createEvent);
router.delete("/",deleteEvent);
router.get("/", getEvent);

const  createEvent = (req, res, next) => {
    eventController.createEvent(req.body)
        .then( data => {
            res.status(data.status).send(data);
        })
}

const deleteEvent = (req, res, next) => {
    eventController.deleteEvent(req.body)
        .then( data => {
            res.status(data.status).send(data);
        })
}

const getEvent = (req, res, next) => {
    if(req.body.eventID){
        eventController.getEvent(req.body)
            .then( data => {
                res.status(data.status).send(data);
            })
    } else {
        eventController.getAllEvent(req.body)
        .then( data => {
            res.status(data.status).send(data);
        })
    }
}

module.exports = router;
