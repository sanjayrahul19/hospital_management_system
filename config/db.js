const mongoose = require("mongoose");
const url =
  "mongodb+srv://sanjayrahul:1234567890@cluster0.c1oms.mongodb.net/Hospital_Management?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(url);
    console.log(`mongoDB connected:${con.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
