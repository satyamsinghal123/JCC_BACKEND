const mongoose = require("mongoose")
const HappeningSchema = require("../Schema/HappeningSchema")

const Happeningmodel = mongoose.model("LatestUpdate" , HappeningSchema)

module.exports = Happeningmodel