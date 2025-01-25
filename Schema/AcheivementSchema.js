const { Schema } = require("mongoose");

const AcheivementSchema = new Schema({
  name: { type: String, required: true },
  dept: { type: String, required: true },
  Course: { type: String, required: false },
  img: { type: String, required: true },
  sem: { type: String, required: false },
  desc: { type: String, required: true },
  type : { type: String, required: true },
});

module.exports = AcheivementSchema;
