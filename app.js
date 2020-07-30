const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const planRouter = require("./router/planRouter");
const userRouter = require("./router/userRouter");
const viewRouter = require("./router/viewRouter");
const reviewRouter = require("./router/reviewRouter");
const bookingRouter = require("./router/bookingRouter");
const bookingController = require("./controller/bookingController");

app.post("/webhook-checkout",bodyParser.raw({ type: 'application/json' }), bookingController.createBooking);

process.env.NODE_ENV=process.env.NODE_ENV||"dev";
app.use(cookieParser());
app.use(express.json());
// 
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/resetPassword/:token',express.static("public"));
app.use('/updateUser/:id',express.static("public"));
app.use('/updatePlan/:id',express.static("public"));
app.use('/plans/:id',express.static("public"));

// templating engine
app.set("view engine", "pug");
// templates address
app.set("views", "views");

app.use("/", viewRouter);
app.use("/api/plans", planRouter)
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);
// wildcard
app.use("*", function (req, res) {
  return res.status(404).json({
    status: "Resource not found",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server is listening at port 3000");
});






