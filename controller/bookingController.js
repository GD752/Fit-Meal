let SK=process.env.SK||require("../configs/config").SK;
const stripe = require("stripe")(SK);
const planModel = require("../model/planModel");
const userModel = require("../model/userModel");
let bookingModel = require("../model/bookingModel");
async function createSession(req, res) {
  console.log("In session")
  // retrive your plan and user
  try {

    let { id } = req
    let userId = id;
    let { planId,add,time } = req.body;
    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);
    console.log(user)
    console.log(plan)
    //  create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      client_reference_id: planId,
      metadata: {address:add,time:time},
      line_items: [
        {
          name: plan.name,
          description: plan.description,
          amount: plan.price * 100,
          currency: "inr",
          quantity: 1
        }
      ],
      success_url: `${req.protocol}://${req.get("host")}/bookingsPage`,
      cancel_url: `${req.protocol}://${req.get("host")}/plans`
    })
    res.status(200).json({
      status: "success",
      session,
      userId
    })
  } catch (err) {
    console.log(err.message)
    res.status(200).json({
      err: err.message
    })
  }
}
module.exports.createSession = createSession;