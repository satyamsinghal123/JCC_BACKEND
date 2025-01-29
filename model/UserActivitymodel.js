const mongoose = require("mongoose")

const UserActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  loginTime: { type: Date, required: true },
})

module.exports = mongoose.model("UserActivity", UserActivitySchema)