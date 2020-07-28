const mongoose = require("mongoose");
let dateNow= new Date();
let dateT=new Date();
dateT.setDate(dateT.getDate+1);
dateT.setHours(12);
dateT.setMinutes(0)
const bookingSchema = new mongoose.Schema({
  bookedAt: {
    type: Date,
    default: dateNow
  },
  timeOfDel: {
      type: Date,
      default: dateT
  },
  delAddress:{
    type: String,
    required:[true,"Address needed for delivery"]
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: "planmodels",
    required: [true, "Booking must be of a plan"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "usermodels",
    required: [true, "Booking must be for a user"]
  },
  expires: {
    type: Date,
    default: +dateNow + 30*24*60*60*1000
  }
})

const bookingModel = mongoose.model("bookingmodels", bookingSchema);
module.exports = bookingModel;
