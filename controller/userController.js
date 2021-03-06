const userModel = require("../model/userModel");
const fs = require("fs");
const sharp = require("sharp");
async function getMe(req, res) {
  try {
    const id = req.id;
    const user = await userModel.findById(id);
    res.status(200).json({
      data: user,
      status: "successfull"
    })
  }
  catch (err) {
    res.status(400).json({
      err
    })
  }
}

async function createUser(req, res) {
  // data
  try {
    const user = userModel.create(req.body);
    res.status(201).json({
      status: "successfull",
      data: user
    })
  } catch (err) {
    res.status(500).json({
      err
    })
  }
}
async function getAllUsers(req, res) {
  try {
    const users = await userModel.find();
    res.status(200).json({
      data: users,
      status: "successfull"
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err
    })
  }
}

// protectRoute
async function updateProfileHandler(req, res) {
  try {
    const id = req.id;
    const user = await userModel.findById(id);
    // process image
    let toBesavedImagePath = `public/img/users/user-${Date.now()}.jpeg`;
    await sharp(req.file.path).toFormat("jpeg").jpeg({ quality: 60 }).toFile(toBesavedImagePath);
    // public remove 
    let iDBLink = toBesavedImagePath.split("/").slice(1).join("/")
    // user update 
    user.profileImage = iDBLink;
    await user.save({
      validateBeforeSave: false
    })
    //  user profile Image link update
    // process update public folder 
    //db link update 
    // console.log(user);
    res.status(200).json({
      success: "Image uploaded"
    })
    // extra work 
    fs.promises.unlink(req.file.path);
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: "something went wrong"
    })
  }
}

async function updateProfileHandler2(req, res) {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    // process image
    let toBesavedImagePath = `public/img/users/user-${Date.now()}.jpeg`;
    await sharp(req.file.path).toFormat("jpeg").jpeg({ quality: 60 }).toFile(toBesavedImagePath);
    // public remove 
    let iDBLink = toBesavedImagePath.split("/").slice(1).join("/")
    // user update 
    user.profileImage = iDBLink;
    await user.save({
      validateBeforeSave: false
    })
    //  user profile Image link update
    // process update public folder 
    //db link update 
    res.status(200).json({
      success: "Image uploaded"
    })
    // extra work 
    fs.promises.unlink(req.file.path);
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: "something went wrong"
    })
  }
}

async function updateInfo(req,res){
  try {
    const id = req.id;
    const user = await userModel.findById(id);
    const {email,name}=req.body;
    user.name=name;
    user.email=email;
    await user.save({
      validateBeforeSave: false
    })
    //  user profile Image link update
    // process update public folder 
    //db link update 
    res.status(200).json({
      success: "updated info"
    })
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: "something went wrong"
    })
  }
}

async function updateUser(req,res){
  try {
    const {id} = req.params;
    const user = await userModel.findById(id);
    const {email,name,role}=req.body;
    user.name=name;
    user.email=email;
    user.role=role;
    await user.save({
      validateBeforeSave: false
    })
    //  user profile Image link update
    // process update public folder 
    //db link update 
    res.status(200).json({
      success: "updated info"
    })
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: "something went wrong"
    })
  }
}

async function removeUser(req,res){
  try{
    let id=req.params.id;
    let del=await userModel.findByIdAndDelete(id);
    if(del){
      res.status(200).json({
        success: "User Info Deleted"
      })
    }
  } 
  catch (err) {
      console.log(err);
      res.status(200).json({
        status: "something went wrong"
      })
    }
}

module.exports.getAllUsers = getAllUsers;
// module.exports.getUser=getUser;
module.exports.createUser = createUser;
module.exports.updateInfo=updateInfo;
module.exports.removeUser=removeUser;
module.exports.updateProfileHandler = updateProfileHandler;
module.exports.updateUser=updateUser;
module.exports.updateProfileHandler2 = updateProfileHandler2;

module.exports.getMe = getMe;
