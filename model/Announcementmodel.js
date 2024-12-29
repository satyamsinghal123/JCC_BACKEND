const mongoose = require("mongoose")
const AnnouncementSchema = require("../Schema/AnnouncementSchema")

const Announcementmodel = mongoose.model("Announcement", AnnouncementSchema)

module.exports = Announcementmodel