const mongoose = require("mongoose")
const AcheivementSchema = require("../Schema/AcheivementSchema")

const Acheivementmodel = mongoose.model("Acheivement" , AcheivementSchema)

module.exports = Acheivementmodel