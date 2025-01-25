const mongoose = require("mongoose")
const HappeningSchema = require("../Schema/HappeningSchema")

const Happeningmodel = mongoose.model("Happening" , HappeningSchema)

module.exports = Happeningmodel