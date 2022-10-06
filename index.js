const express = require("express");
const userRoute = require('./routes/userRoute.js')
const eventRoute = require("./routes/event-route.js");
const mainRoute = require("./routes/main-route.js");
var cors = require("cors");
const path = require("path");
const AppError = require("./utils/appError.js");
const cookieParser = require('cookie-parser')


const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// EJS engine
app.set("view engine", "ejs");
app.set("views", "public");

//Serve static files
app.use(express.static(path.join(__dirname, "public")));

//user route
app.use('/api/user', userRoute);
// Event Route
app.use("/event", eventRoute);
// Main Route
app.use("/", mainRoute);

app.use('*', (req, res, next)=>{
    return next( new AppError('No route like that!', 404))
})

//global error handler
app.use( ( err, req, res, next)=>{
    res.status(404).json({
        status: err.status,
        message: err.message
    })
})

// Database Connection
// const connection = require("./utils/database");
// connection.on("error", console.error.bind(console, "connection error: "));
// connection.once("open", function () {
//     console.log("Database Connected successfully");
// })


// Starting App
app.listen(port, function(){
    console.log("App is running at port " + port);
})