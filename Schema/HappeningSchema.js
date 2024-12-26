const { Schema } = require("mongoose");

const HappeningSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    depart : {
        type : String,
        required : true
    },
    
    start : {
        type : String,
        required : true
    },
    lastApply : {
        type : String,
        required : true
    },
    
    
})

module.exports = HappeningSchema