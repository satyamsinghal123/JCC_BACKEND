const mongoose = require("mongoose")
const StudentCornerSchema = require("../Schema/StudentCornerSchema")

const StudentCornermodel = mongoose.model("StudentCorner", StudentCornerSchema)

module.exports = StudentCornermodel