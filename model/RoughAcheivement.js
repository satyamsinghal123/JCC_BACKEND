const mongoose = require("mongoose")
const RoughAcheivementSchema = require("../Schema/RoughAcheivement")

const RoughAcheivementmodel = mongoose.model("RoughAcheivement" , RoughAcheivementSchema)

module.exports = RoughAcheivementmodel