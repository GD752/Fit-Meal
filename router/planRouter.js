const express = require("express")
const planRouter = express.Router();
const { getAllPlans, getPlan, removePlan, createPlan, updatePlan } = require("../controller/planController")
const { protectRoute, isAuthorized, isAdmin } = require("../controller/authController")
planRouter
  .route("")
  .get(getAllPlans)
  .post(protectRoute, isAuthorized(["admin", "resturant owner"]), createPlan);
planRouter
  .route("/:planId")
  .get(getPlan)
  .patch(updatePlan);
planRouter.delete('/delete/:id',isAdmin,removePlan);
planRouter.patch('/updatePlan/:id',isAdmin,updatePlan);

module.exports = planRouter;

// server => route ,get,post 
// server => request => getplan