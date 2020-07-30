let SK=process.env.SK||require("../configs/config").SK;
const stripe = require("stripe")(SK);
const planModel = require("../model/planModel");
const userModel = require("../model/userModel");
let bookingModel = require("../model/bookingModel");
const WKEY=process.env.WKEY||require("../configs/config").WKEY;
async function createSession(req, res) {
  console.log("In session")
  // retrive your plan and user
  try {

    let { id } = req
    let userId = id;
    let { planId,add,time } = req.body;
    console.log(add)
    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);
    console.log(user)
    console.log(plan)
    //  create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      client_reference_id: planId,
      metadata: {'address': add,'time': time},
      line_items: [
        {
          name: plan.name,
          description: plan.description,
          amount: plan.price * 100,
          currency: "inr",
          quantity: 1
        }
      ],
      success_url: `${req.protocol}://${req.get("host")}/myBookings`,
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

const createNewBooking = async function (userEmail, planId,data) {
  try{
    const user = await userModel.findOne({ email: userEmail });
    const plan = await planModel.findById(planId);
    const userId = user["_id"];
    const bookedPlan= await bookingModel.findOne({user: userId, plan: planId})
    if (bookedPlan) {
      console.log(bookedPlan.expires)
      bookedPlan.delAddress= data.address
      bookedPlan.time= data.time
      if(bookedPlan.status=="Active")
        bookedPlan.expires.setTime(bookedPlan.expires.getTime()+30*24*60*60*1000)
      console.log(bookedPlan.expires)
      await bookedPlan.save({
        validateBeforeSave: false
      })
      console.log(bookedPlan.expires)
    }
    else {
      console.log("In create new bookings else")
      const order = {
          user: userId,
          delAddress: data.address,
          time: data.time,
          plan: planId,
        }
      const newOrder = await bookingModel.create(order);
      if(user.bookings==undefined)
        user.bookings=[(newOrder["_id"])];
      else
        user.bookings.push(newOrder["_id"])
      await user.save({ validateBeforeSave: false });
    }
  }
  catch(err){
    return err.message
  }
}

module.exports.createBooking = async function (request, response) {
  const sig = request.headers['stripe-signature'];
  let event;
  const endpointSecret = WKEY;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // console.log(event);
  }
  catch (err) {
  return  response.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if(event.type=="checkout.session.completed"){
    const userEmail = event.data.object.customer_email;
  //  => session
    console.log(event.data.object);
    const planId = event.data.object.client_reference_id;
    const data=event.data.object.metadata;
    console.log(data)
    await createNewBooking(userEmail, planId, data);
    // payment complete
  }
  response.json({ received: true });
}

module.exports.createSession = createSession;