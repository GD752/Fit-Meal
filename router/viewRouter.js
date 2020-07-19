const express = require("express");
const viewRouter = express.Router();
const { getTestPage,getSignupPage,getUsersListing, getPlansListing, getLoginPage, getHomePage, getProfilePage, getForgetPasswordPage,getResetPage,getSomethingWentWrong, getUpdateInfo,getUpdateUser} = require("../controller/viewController");
const { isUserLoggedIn, protectRoute, handleResetRequest, resetPassword, isAdmin,handleUserUpdate } = require("../controller/authController");
// token
viewRouter.use(isUserLoggedIn)
viewRouter.get("/manageUsers", isAdmin,getUsersListing);
viewRouter.get("/plans", getPlansListing);
viewRouter.get("/test", getTestPage);
viewRouter.get("/login", getLoginPage);
viewRouter.get("/signup", getSignupPage);
viewRouter.get("/", getHomePage);
viewRouter.get("/profilePage", protectRoute, getProfilePage);
viewRouter.get("/updateInfo", protectRoute, getUpdateInfo);
viewRouter.get("/forgetPassword", getForgetPasswordPage);
viewRouter.get("/somethingWentWrong", getSomethingWentWrong);
// redirection=> function will not be middleware => req,res object are not shared
viewRouter.get("/resetPassword/:token", handleResetRequest,getResetPage)
viewRouter.get("/updateUser/:id",isAdmin,getUpdateUser)
module.exports = viewRouter;
