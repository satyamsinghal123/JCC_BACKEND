const { Schema } = require("mongoose");

const ThoughtSchema = new Schema({

    thought :{type : String , required : true},
    date : {type : String , required : false}
    
})

module.exports = ThoughtSchema