const mongoose = require("mongoose")
const UserSchema = require("../Schema/UserSchema")


const Usermodel = mongoose.model("User", UserSchema)

module.exports = Usermodel