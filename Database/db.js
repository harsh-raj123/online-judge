const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DBConnection = async () => {
    const MONGO_URI = process.env.MONGODB_URL;
    console.log("MONGO_URI from .env:", MONGO_URI); // Add this

    try {
        await mongoose.connect(MONGO_URI,{useNewUrlParser: true,
    useUnifiedTopology: true});
        console.log("DB connection established");

    }
    catch (error) {
        console.log("error while connecting to mongoDB", error);
    }
};
module.exports = { DBConnection };