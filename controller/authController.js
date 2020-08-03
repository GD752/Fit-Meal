// signup
//  user create
const userModel = require("../model/userModel");
const Email = require("../utility/email");
const jwt = require("jsonwebtoken");
const JWT_SECRET  = process.env.JWT_SECRET||require("../configs/config").JWT_SECRET;
const { json } = require("express");
const Bcrypt = require("bcryptjs");
async function signup(req, res) {
  try {
    const data=req.body;
    if(data.password!=data.confirmPassword){
      throw "Password and Confirm Password should be same"
    }
    data['confirmPassword']=undefined;
    data.password = Bcrypt.hashSync(data.password, 10);
    console.log(data.password)
    const user = await userModel.create(data);
    console.log(user);
    res.status(201).json({
      status: "user signed up",
      user
    })
  } catch (err) {
    console.log("In catch of signup")
    console.log(err.message)
    res.status(400).json({ err: err.message })
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const user = await userModel.findOne({ email }).select("+password");
    console.log(user);
    const check=Bcrypt.compareSync(password, user.password)
    if (user) {
      if (check) {
        // jwt
        const { _id } = user;
        const token = jwt.sign({ id: _id }, JWT_SECRET, {
          expiresIn: Date.now() + 1000 * 60 * 30
        })
        // console.log("I was here");
        // console.log(token);
        res.cookie("jwt", token, { httpOnly: true });
        return res.status(200).json({
          status: "successfull",
          token
        })

      } else {
        throw new Error("user or password didn't match")
      }
    } else {
      throw new Error("user or password didn't match ");
    }
  } catch (err) {
    console.log("Inside catch")
    console.log(err);
    res.json({
      err: err.message
    })
  }
}
// authenticate => user
async function protectRoute(req, res, next) {
  try {
    // headers 
    let token
    if (req.headers && req.headers.authorization) {
      token = req.headers.authorization.split(" ").pop();
      // console.log(token)
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    else {
      throw new Error("Please provide a token");
    }
    if (token) {
      const decryptedData = jwt.verify(token, JWT_SECRET);
      if (decryptedData) {
        const id = decryptedData.id;
        req.id = id;
        next();
      } else {
        throw new Error("Invalid Token");
      }
    } else {
      throw new Error("Please login again to access this route ");
    }

  } catch (err) {
    // console.log(err);
    res.status(200).json({
      status: "unsuccessfull",
      err: err.message
    })
  }
}
async function isUserLoggedIn(req, res, next) {
  try {
    // headers 
    let token
    if (req.headers && req.headers.authorization) {
      token = req.headers.authorization.split(" ").pop();
      // console.log(token)
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    else {
      console.log(token)
      return next();
    }
    console.log(token);
    if (token) {
      const decryptedData = jwt.verify(token, JWT_SECRET);
      if (decryptedData) {
        const id = decryptedData.id;
        // console.log(id);
        // console.log(decryptedData)
        req.id = id;
        req.user = await userModel.findById(id);
        // console.log(req.user);
        return next();
      } else {
        return next();
      }
    } else {
      return next();
    }

  } catch (err) {
    console.log("I was in catch user");
    res.status(200).json({
      status: "unsuccessfull",
      err: err.message
    })
  }
}


// authorization
async function isAdmin(req, res, next) {
  try {
    const user = await userModel.findById(req.id);
    if (user) {
      if (user.role == "admin") {
        next()
      } else {
        throw new Error("User not authorized");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
}

function isAuthorized(roles) {
  return async function (req, res, next) {
    try {

      const { id } = req;
      const user = await userModel.findById(id);
      const { role } = user;
      if (roles.includes(role) == true) {
        next()
      } else {
        throw new Error("You are not authorized ");
      }
    } catch (err) {
      console.log(err);
      res.status(403).json(
        { err: err.message }
      )
    }
  };
}
async function logout(req, res) {
  res.cookie("jwt", "bgfdgcgf", { expires: new Date(Date.now() + 100) });
  res.json({
    status: "logged Out"
  })
}
async function forgetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    // const user = users[0];
    if (user) {
      const token = user.createToken();
      // db => save
      // db => integrity ,consistency
      await user.save({ validateBeforeSave: false });
      // email 
      const resetPasswordLink = `http://localhost:3000/resetPassword/${token}`
      const emailOptions = {};
      emailOptions.html = `<h1>Please click on the link to reset your password </h1>
      <p>${resetPasswordLink}</p>
      `;
      emailOptions.to = email;
      emailOptions.from = "appgdev@gmail.com";
      emailOptions.subject = "Reset Password Link"
      await Email(emailOptions);
      res.status(200).json({
        resetPasswordLink,
        status: `Email sent to ${email}`
      })
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message
    })
  }
}
async function handleResetRequest(req, res, next) {
  try {
    const { token } = req.params;
    console.log(token);
    let user = await userModel.findOne({ resetToken: token });

    if (user) {

      req.token = token;
      console.log("220 " + req.token)
      next();

      // token verify 
    } else {
      res.redirect("/somethingWentWrong");
    }

  } catch (err) {
    res.redirect("/somethingWentWrong");
  }
}

async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    const user = await userModel.findOne({ resetToken: token });
    if (user) {
      if (Date.now() < user.expiresIn) {
        const data=req.body;
        if(data.password!=data.confirmPassword){
          throw "Password and Confirm Password should be same"
        }
        data.password = Bcrypt.hashSync(req.body.password, 10);
        const { password} = req.body;
        user.resetPasswordhelper(password,token);
        await user.save();
        console.log(user)
        res.status(200).json({
          success: "user password updated login with new password"
        })
      } else {
        throw new Error("token has expired");
      }
    } else {
      throw new Error("user not found");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message
    })
  }
  // resetPassword/svmbamvbd
  // db => svmbamvbd=> user search => user
  // user => password
}




module.exports.signup = signup;
module.exports.login = login;
module.exports.protectRoute = protectRoute;
module.exports.isAdmin = isAdmin;
module.exports.isAuthorized = isAuthorized;
module.exports.forgetPassword = forgetPassword;
module.exports.resetPassword = resetPassword;
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.logout = logout;
module.exports.handleResetRequest = handleResetRequest;


