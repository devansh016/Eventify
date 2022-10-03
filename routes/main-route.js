const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", servehomepage);

function servehomepage(req, res, next){
    var events = JSON.parse(fs.readFileSync(path.join(__dirname, "../events.json"),"utf8"))
    var profile =JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"),"utf8"))
    res.render("index.ejs", { events, profile });
}

module.exports = router;