const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.ObjectId,
    ref: "usermodels",
    required:[true,"Booking must be done by user"]
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
  exp: {
    type: Date,
    default: new Date(Date.now()+30*24*60*60*1000)
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

bookingSchema.virtual('status')
.get(function(){
  if(new Date().getTime()>this.exp.getTime())
    return "Expired"
  else return "Active"
})
const bookingModel = mongoose.model("bookingmodels", bookingSchema);
module.exports = bookingModel;
