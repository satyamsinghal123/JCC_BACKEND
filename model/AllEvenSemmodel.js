const mongoose = require("mongoose")
const AllEvenSemSchema = require("../Schema/AllEvenSemSchema")

const AllEvenSemmodel = mongoose.model("EvenSem", AllEvenSemSchema)

module.exports = AllEvenSemmodel