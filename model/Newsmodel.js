const mongoose = require("mongoose");
const NewsSchema = require("../Schema/NewsSchema")

const Newsmodel = mongoose.model("News" , NewsSchema)

module.exports = Newsmodel