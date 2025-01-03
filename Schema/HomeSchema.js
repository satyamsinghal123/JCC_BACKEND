const { Schema } = require("mongoose")

const BulletinContentSchema = new Schema({
  // Common fields
  dates: String,
  fee: String,
  deadline: String,
  payment: String,
  contact: String,
  
  // Fields for non-exchange type
  date: String,
  time: String,
  venue: String,
  register: String,
  challenge: String,
  
  // You can add more fields as needed
}, { _id: false, strict: false })

const BulletinDataSchema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: BulletinContentSchema, required: true }
}, { _id: false })

const HomeSchema = new Schema({
  Homebanner: { type: String, required: true },
  bulletinData: { type: [BulletinDataSchema], required: true }
})

module.exports = HomeSchema

