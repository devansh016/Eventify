require("dotenv").config()
const mongoose = require("mongoose")

const connectionOptions = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}

mongoose.connect(process.env.MONGODB_URL, connectionOptions)
mongoose.Promise = global.Promise

const connection = mongoose.connection;

module.exports = connection