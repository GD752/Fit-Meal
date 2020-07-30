const mongoose = require("mongoose");
let dateNow= new Date();
let dateT=new Date();
dateT.setDate(dateT.getDate+1);
dateT.setHours(9);
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
bookingSchema.virtual('time')
.get(function(){
  return this.timeOfDel.getTime();
})
.set(function(ntime){
  let tarr=ntime.split(':');
  this.set('timeOfDel', new Date(2020,0,1,tarr[0],tarr[1],tarr[2]));
})
const bookingModel = mongoose.model("bookingmodels", bookingSchema);
module.exports = bookingModel;
