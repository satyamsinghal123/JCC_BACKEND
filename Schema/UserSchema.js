const { Schema } = require("mongoose")

const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
})

module.exports = UserSchema

