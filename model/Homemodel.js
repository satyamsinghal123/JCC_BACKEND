const mongoose = require("mongoose")
const HomeSchema = require("../Schema/HomeSchema")

const Homemodel = mongoose.model("Home", HomeSchema)

module.exports = Homemodel

