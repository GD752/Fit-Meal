const express = require("express");
const viewRouter = express.Router();
const { getCreatePlan,getUpdatePlan,getConfirmation,getSignupPage,getUsersListing, getPlansListing, getLoginPage, getHomePage, getProfilePage,getContactUs, getForgetPasswordPage,getResetPage,getSomethingWentWrong, getUpdateInfo,getUpdateUser,plansListingUpdatable, getAllBookings, getAboutUs} = require("../controller/viewController");
const { isUserLoggedIn, protectRoute, handleResetRequest, resetPassword, isAdmin, isAuthorized } = require("../controller/authController");
// token
viewRouter.use(isUserLoggedIn)
viewRouter.get("/manageUsers", isAdmin,getUsersListing);
viewRouter.get("/plans", getPlansListing);
viewRouter.get("/plans/:id", getConfirmation);
viewRouter.get("/contactUs", getContactUs);
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
viewRouter.get("/updatePlan/:id",isAdmin,getUpdatePlan)
viewRouter.get("/managePlans",isAdmin,plansListingUpdatable)
viewRouter.get("/bookingsPage",isAdmin,getAllBookings)
viewRouter.get("/addPlan",isAuthorized(["admin", "resturant owner"]),getCreatePlan)
viewRouter.get("/aboutUs",getAboutUs)
module.exports = viewRouter;
