let SK=process.env.SK||require("../configs/config").SK;
const stripe = require("stripe")(SK);
const planModel = require("../model/planModel");
const userModel = require("../model/userModel");
async function createSession(req, res) {
  console.log("In session")
  // retrive your plan and user
  try {

    let { id } = req
    let userId = id;
    let { planId } = req.body;

    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);
    console.log(user)
    console.log(plan)
    //  create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      client_refernce_id: req.planId,
      line_items: [
        {
          name: plan.name,
          description: plan.description,
          // deploy website 
          amount: plan.price * 100,
          currency: "inr",
          quantity: 1
        }
      ],
      // dev => http
      // production => https 
      success_url: `${req.protocol}://${req.get("host")}/profilePage`,
      cancel_url: `${req.protocol}://${req.get("host")}/plans`
    })
    res.status(200).json({
      status: "success",
      session
    })
  } catch (err) {
    res.status(200).json({
      err: err.message
    })
  }
}
module.exports.createSession = createSession;