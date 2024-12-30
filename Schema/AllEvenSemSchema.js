const {Schema} = require("mongoose")

const AllEvenSemSchema = new Schema({
    date : {type : String , required : true},
    title : {type : String , required : true},
    subtitle : {type : String },
    type : {type : String , required : true},
})

module.exports = AllEvenSemSchema