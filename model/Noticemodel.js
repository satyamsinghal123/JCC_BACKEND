const mongoose = require("mongoose")
const NoticeSchema = require("../Schema/NoticeSchema")


const Noticemodel = mongoose.model("Notice", NoticeSchema)

module.exports = Noticemodel