const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const con = await mongoose.connect("mongodb://localhost:27017/best");
        console.log(`Successfully Connected: ${con.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB;