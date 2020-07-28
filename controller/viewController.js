// 1
let planModel = require("../model/planModel");
let userModel = require("../model/userModel");
let bookingModel = require("../model/bookingModel");

async function getPlansListing(req, res) {
  const user = req.user;
  let val=req.query.name;
  let sp=req.query.sort;
  let mysort=null;
  if(sp){
    console.log(sp)
    let sp1=sp.split(' ').shift();
    let od=sp.split(" ").pop()
    mysort=[[sp1,od]]
  }
  const plans= await planModel.find({'name':new RegExp(val,'i')}).sort(mysort);
  res.render("plansListing.pug", {
    title: "Plans page",
    // 3
    plans: plans,
    user,val
  })
}

async function getAllBookings(req,res){
  const bookings=await bookingModel.findAll();
  const user = req.user;
  res.render('allBookings',{
    title: 'Booking Details',
    bookings: bookings,
    user
  })
}

async function getMyBookings(req,res){
  const user = req.user;
  const bookings=await bookingModel.find({'user':user.id});
  res.render('myBookings',{
    title: 'My Booking Details',
    bookings: bookings,
    user
  })
}

async function plansListingUpdatable(req, res) {
  let val=req.query.name;
  let sp=req.query.sort;
  let mysort=null;
  if(sp){
    console.log(sp)
    let sp1=sp.split(' ').shift();
    let od=sp.split(" ").pop()
    mysort=[[sp1,od]]
  }
  const plans= await planModel.find({'name':new RegExp(val,'i')}).sort(mysort);
  res.render("updatePlanList.pug", {
    title: "Plans page",
    plans: plans,
    user,val
  })
}

async function getUsersListing(req, res) {
  const user = req.user;
  let val=req.query.name;
  const users = await userModel.find({'name':new RegExp(val,'i')});
  res.render("usersListing.pug", {
    title: "Users page",
    users: users,
    user,val
  })
}

async function getLoginPage(req, res) {
  const user = req.user;
  console.log(req.user);
  res.render("login.pug", {
    title: "Login Page",
    user
  })
}

async function getContactUs(req, res) {
  const user = req.user;
  res.render("contact", {
    title: "Contact Page",
    user
  })
}

async function getCreatePlan(req,res){
  const user=req.user;
  res.render("createPlan",{
    title: 'Create Plan',
    user
  })
}

async function getSignupPage(req, res) {
  const user = req.user;
  res.render("signup.pug", {
    title: "Signup Page",
    user
  })
}

async function getHomePage(req, res) {
  const user = req.user;
  res.render("Home.pug", {
    title: "Home Page",
    user
  })
}
async function getProfilePage(req, res) {
  const user = req.user;
  res.render("profilePage.pug", {
    title: "Profile Page",
    user
  })
}
async function getUpdateInfo(req, res) {
  const user = req.user;
  res.render("updateInfo.pug", {
    title: "Update Info",
    user
  })
}

async function getUpdateUser(req, res) {
  const user=req.user;
  const id=req.params.id;
  const user1 =await userModel.findById(id);
  res.render("updateUser.pug", {
    title: "Update User",
    user,
    user1
  })
}

async function getUpdatePlan(req, res) {
  const user=req.user;
  const id=req.params.id;
  const plan =await planModel.findById(id);
  console.log(plan);
  res.render("updatePlan.pug", {
    title: "Update Plan",
    user,
    plan
  })
}

async function getForgetPasswordPage(req, res) {
  res.render("forgetPassword.pug", {
    title: "ForgetPassword"
  })
}
async function getResetPage(req, res) {
  const { token } = req;
  res.render("resetPassword", { token });

}
async function getSomethingWentWrong(req, res) {
  res.render("somethingWentWrong");
}
async function getConfirmation(req,res){
  const user=req.user;
  const plan=await planModel.findById(req.params.id)
  res.render('beforePayment',{
    title: "Payment Confirmation",
    plan,
    user
  })
}

async function getAboutUs(req,res){
  const user= req.user;
  res.render('about',{
    title:"About Us",
    user
  })
}

module.exports.getConfirmation=getConfirmation;
module.exports.getPlansListing = getPlansListing;
module.exports.getUsersListing = getUsersListing;
module.exports.getLoginPage = getLoginPage;
module.exports.getSignupPage = getSignupPage;
module.exports.getHomePage = getHomePage;
module.exports.getProfilePage = getProfilePage;
module.exports.getUpdateInfo = getUpdateInfo;
module.exports.getUpdateUser = getUpdateUser;
module.exports.getUpdatePlan = getUpdatePlan;
module.exports.getForgetPasswordPage = getForgetPasswordPage;
module.exports.getResetPage = getResetPage;
module.exports.getSomethingWentWrong = getSomethingWentWrong;
module.exports.getContactUs=getContactUs;
module.exports.plansListingUpdatable=plansListingUpdatable;
module.exports.getCreatePlan=getCreatePlan;
module.exports.getAllBookings=getAllBookings;
module.exports.getMyBookings=getMyBookings;
module.exports.getAboutUs=getAboutUs;