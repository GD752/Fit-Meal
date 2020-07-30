const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.ObjectId
  },
  bookedAt: {
    type: Date,
    default:new Date()
  },
  timeOfDel: {
      type: Date,
      default: new Date(2020,0,1,9,0,0)
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
  expires: {
    type: Date,
    default: +Date.now() + 30*24*60*60*1000
  },
  currentPrice:{
    type: Number
  }
})

bookingSchema.virtual('time')
.get(function(){
  return this.timeOfDel.getTime();
})
.set(function(ntime){
  let tarr=ntime.split(':');
  this.timeOfDel=new Date(2020,0,1,tarr[0],tarr[1],tarr[2]);
})
const bookingModel = mongoose.model("bookingmodels", bookingSchema);
module.exports = bookingModel;
