const mongoose = require("mongoose")
const ClubandSocietySchema = require("../Schema/ClubandSocietySchema")

const ClubandSocietymodel = mongoose.model("ClubandSociety", ClubandSocietySchema)

module.exports = ClubandSocietymodel