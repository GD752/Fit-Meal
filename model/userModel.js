const mongoose = require("mongoose");
const link=process.env.DB_LINK||require("../configs/config").DB_LINK
const crypto = require("crypto");
// mongodb cloud db 
mongoose.connect(link, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(function (conn) {
  // console.log("Connection to mongodb established");
  // console.log(conn)
  console.log("User Db connected");
}).catch(function (err) {
  console.log(err);
})
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
  }, email: {
    type: String,
    required: [true, "email is required"],
    unique: true
  }, password: {
    type: String,
    minlength: 7,
    required: [true, "password is required"],
    select: false
  }, role: {
    type: String,
    enum: ["admin", "restaurant owner", "Delivery Boy", "user"],
    default: "user"
  },
  resetToken: String,
  expiresIn: String,
  profileImage: {
    type: String,
    default: "/img/users/default.jpeg"
  },
  bookings:{
    type: String
  }
})

userSchema.pre("save", function () {
  this.confirmPassword = undefined;
})
userSchema.methods.createToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  // user
  this.resetToken = token
  this.expiresIn = Date.now() + 10 * 1000 * 60;
  // 
  return token;
}
userSchema.methods.resetPasswordhelper = function (password) {
  this.password = password;
  this.resetToken = undefined;
  this.expiresIn = undefined;
}
const userModel = mongoose.model("usermodels", userSchema);
module.exports = userModel;