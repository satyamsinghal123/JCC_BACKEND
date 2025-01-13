const { Schema } = require("mongoose");

const UserSchema = new Schema({

    name :{type : String , required : true},
    password : {type : String , required : true}
    
})

module.exports = UserSchema