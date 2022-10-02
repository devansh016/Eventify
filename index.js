const express = require("express");
var cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

//Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Starting App
app.listen(port, function(){
    console.log("App is running at port " + port);
})