const { Schema } = require("mongoose");

const HappeningSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  }
  
  
});

module.exports = HappeningSchema;