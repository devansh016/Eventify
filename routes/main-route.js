const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", servehomepage);

function servehomepage(req, res, next){
    var data =JSON.parse(fs.readFileSync(path.join(__dirname, "../public/data.json"),"utf8"))
    console.log(data);
    res.render("index.ejs", { data });
}

module.exports = router;