const mongoose = require("mongoose")
const LatestUpdateSchema = require("../Schema/LatestUpdateSchema")

const LatestUpdatemodel = mongoose.model("LatestUpdate" , LatestUpdateSchema)

module.exports = LatestUpdatemodel