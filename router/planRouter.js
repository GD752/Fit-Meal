const express = require("express")
const planRouter = express.Router();
const { getPlan, removePlan, createPlan, updatePlan } = require("../controller/planController")
const { protectRoute, isAuthorized, isAdmin } = require("../controller/authController")
planRouter
  .route("")
  .post(protectRoute, isAuthorized(["admin", "resturant owner"]), createPlan);
planRouter
  .route("/:planId")
  .get(getPlan)
planRouter.delete('/delete/:id',isAdmin,removePlan);
planRouter.patch('/updatePlan/:id',isAdmin,updatePlan);
// planRouter.get('/:val',getSearchPlans);

module.exports = planRouter;

// server => route ,get,post 
// server => request => getplan