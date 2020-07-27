const mongoose = require("mongoose");
let dateNow=new Date();
dateNow.setDate(dateNow.getDate+1);
dateNow.setHours(12);
dateNow.setMinutes(0)
const bookingSchema = new mongoose.Schema({
  bookedAt: {
    type: Date,
    default: new Date()
  },
  timeOfDel: {
      type: Date,
      default: dateNow
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
  }
})

const bookingModel = mongoose.model("bookingSchema", bookingSchema);
module.exports = bookingModel;
