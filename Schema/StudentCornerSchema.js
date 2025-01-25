const { Schema } = require("mongoose");

const StudentCornerSchema = new Schema({

    type: {
        type: String,
        required: true,
      },
      
      link: {
        type: String,
        required: true,
      },
      course: {
        type: String,
        required: true,
      },
      semester: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    
})

module.exports = StudentCornerSchema