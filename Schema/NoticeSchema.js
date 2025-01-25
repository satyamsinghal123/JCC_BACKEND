const { Schema } = require("mongoose");

const NoticeSchema = new Schema({

    type :{type : String , required : true},
    message : {type : String , required : true}
    
})

module.exports = NoticeSchema