const mongoose = require("mongoose")
const ThoughtSchema = require("../Schema/ThoughtSchema")


const Thoughtmodel = mongoose.model("thought", ThoughtSchema)

module.exports = Thoughtmodel