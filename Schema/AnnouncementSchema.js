const {Schema} = require("mongoose")

const AnnouncementSchema = new Schema({
    category : {type : String , required : true},
    text : {type : String , required : true},
})

module.exports = AnnouncementSchema