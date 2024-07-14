const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId:String,
    displayName:String,
    email:String,
    image:String
},{timestamps:true});


const users = new mongoose.model("users",userSchema);

module.exports = users;