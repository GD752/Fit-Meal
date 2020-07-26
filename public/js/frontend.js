let d = document;
const stripe = Stripe('pk_test_51H9EFGK2USD6katkGsCCEPQ3iEDgldLR0ubytDQ3ZrTmi7xh452z8kYS4pYzlKFBmbMVELAe9FN96h8xFT5w5yik006PlPtHdB');
let loginBtn = d.querySelector(".login-button");
let signupForm = d.querySelector(".signup");
let logoutBtn = d.querySelector(".logout");
let forgetForm = d.querySelector(".forgetPassword");
let resetPasswordForm = d.querySelector(".resetPassword");
let updateMyInfo=d.querySelector(".updateMyInfo")
let updateUserInfo=d.querySelector(".updateUserInfo")
let updatePlanInfo=d.querySelector(".updatePlanInfo")
let updateProfile = d.querySelector(".updateProfile");
let updateProfile2 = d.querySelector(".updateProfile2");
let delElement=d.querySelectorAll(".delicon")
let search=d.querySelector('input[name="search"]')
let addPlan=d.querySelector('.createPlan')
const paymentBtn = d.querySelector(".payment");


async function addPlanHelper(data){
  const response=await axios.post("/api/plans/createPlan",data);
  if (response.data.success) {
    alert("New Plan Created")
    location.assign("/managePlans");
  } else {
    alert("Something went wrong!");
  }
}

if(addPlan){
  addPlan.addEventListener("submit",function(e){
    e.preventDefault();
    let description=d.querySelector("[name=description]").value
    let name=d.querySelector("[name=name]").value
    let price=d.querySelector("[name=price]").value
    let discount=d.querySelector("[name=discount]").value
    if(price&&name&&description&&discount)
      addPlanHelper({name,price, discount, description})
    else
      alert("Invalid entry in field!")
  })
}

async function loginHelper(email, password) {
  const response = await axios.post("/api/users/login", {
    email, password
  })
  if (response.data.status == "successfull") {
    alert("Login Successfull")
    location.assign("/profilePage");
  } else {
    alert("User ID or password is incorrect!");
  }
}


if(search){
  const sbtn=d.querySelector('button[name="searchbtn"]');
  let loc=location.href.split('?').shift();
  sbtn.addEventListener("click",function(e){
    let val=search.value;
    console.log(val);
    e.preventDefault();
    location.replace(`${loc}?name=${val}`)
  })
}

async function signupHelper(email, password, confirmPassword, name) {
  const response = await axios.post("/api/users/signup", {
    email, password, confirmPassword, name
  });
  if(response.data.status=="user signed up") {
    alert("Your are signed up");
    user =response.data.user;
    const {email,password}=user;
    const resp = await axios.post("/api/users/login", {
     email, password
    })
    if (resp.data.status == "successfull") {
      location.assign("/profilePage");
    }
    else{
      alert("please log in with credidentials")
    }
  } else {
    alert("something went wrong")
  }
  console.log(response.data);
}
async function logoutHelper() {
  let response = await axios.get("/api/users/logout");
  if (response.data.status === "logged Out") {
    location.assign("/");
  } else {
    alert("some error ocurred");
  }
}
async function forgetPasswordHelper(email) {
  const response = await axios.patch("/api/users/forgetPassword", { email });
  if (response.data.status) {
    alert("Email Send to user");
  }
}
async function resetPasswordHelper(password, confirmPassword, resetToken) {
  const response = await axios.patch(`/api/users/resetPassword/${resetToken}`,
    {
      password, confirmPassword
    })
  if (response.data.success=="user password updated login with new password") {
    alert("Your password has been reset");
    location.assign("/login");
  } else {
    alert("something went wrong")
  }
}

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    // form reload 
    e.preventDefault();
    const email = d.querySelector(".email").value;
    const password = d.querySelector(".password").value
    const confirmPassword = d.querySelector(".confirmPassword").value;
    const name = d.querySelector(".name").value;
    signupHelper(email, password, confirmPassword, name);
  })
}

if (loginBtn) {
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let email = d.querySelector("input[type=email]").value;
    let password = d.querySelector("input[type=password]").value;
    loginHelper(email, password)
  })
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    // /api/users/logout
    e.preventDefault();
    logoutHelper();
  })
}
if (forgetForm) {
  forgetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let email = d.querySelector(".email").value;
    forgetPasswordHelper(email);
  })
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    //alert("want to reset");
    let password = d.querySelector(".password").value;
    let confirmPassword = d.querySelector(".confirmPassword").value
    let token = d.querySelector("button").getAttribute("data-token");
    resetPasswordHelper(password, confirmPassword, token);

  })
}

async function updateProfileHelper(formData) {
  console.log("Img updater")
  let response = await axios.patch("/api/users/updateProfile", formData);
  if (response.data.success) {
    alert("profile Image uploaded")
    location.reload();
  }else{
    alert("something went wrong");
  }
}
//  image backend 
if (updateProfile) {
  console.log("Img updater")
  updateProfile.addEventListener("change", function (e) {
    e.preventDefault();
    // multipart data send 
    // Browser
    const formData = new FormData();
    formData.append("user", updateProfile.files[0]);
    updateProfileHelper(formData);
  })
}

async function updateInfoHelper(email,name){
  const response = await axios.patch("/api/users/updateInfo", { email,name });
  if (response.data.success) {
    alert("information updated")
    location.reload();
  }else{
    alert("something went wrong");
  }
}

if (updateMyInfo){
  updateMyInfo.addEventListener("submit",function(e){
    e.preventDefault();
    let email=d.querySelector("[name=email]").value
    let name=d.querySelector("[name=name]").value
    if(email&&name)
      updateInfoHelper(email,name)
    else
      console.log("undefined email or name")
  })

}
async function updateElementHelper(data,id,type){
  console.log("Frontend update element helper")
  let path=`/api/users/updateUser/${id}`;
  if(type=='plan'){
    path=`/api/plans/updatePlan/${id}`;
  }
  const response = await axios.patch(path, data);
  if (response.data.success) {
    alert("Information updated")
    location.reload();
  }else{
    alert("something went wrong");
  }
}

if(updatePlanInfo){
  let id=d.querySelector("[name=name]").getAttribute('uid')
  console.log("Plan id:"+id)
  updatePlanInfo.addEventListener("submit",function(e){
    e.preventDefault();
    let description=d.querySelector("[name=description]").value
    let name=d.querySelector("[name=name]").value
    let price=d.querySelector("[name=price]").value
    let discount=d.querySelector("[name=discount]").value
    if(price&&name&&description&&discount)
      updateElementHelper({name,price, discount, description},id,'plan')
    else
      alert("Invalid entry in field!")
  })
}

if (updateUserInfo){
  let id=d.querySelector("[name=name1]").getAttribute('uid')
  updateUserInfo.addEventListener("submit",function(e){
    e.preventDefault();
    let email=d.querySelector("[name=email1]").value
    let name=d.querySelector("[name=name1]").value
    let role=d.querySelector("[name=role1]").value
    if(email&&name&&role)
      updateElementHelper({email,name,role},id,'user')
    else
      console.log("undefined email or name")
  })
  async function updateProfileHelper2(formData,id) {
    let response = await axios.patch(`/api/users/updateProfile/${id}`, formData);
    if (response.data.success) {
      alert("profile Image uploaded")
      location.reload();
    }else{
      alert("something went wrong");
    }
  }
  //  image backend 
  if (updateProfile2) {
    updateProfile2.addEventListener("change", function (e) {
      e.preventDefault();
      // multipart data send 
      // Browser
      const formData = new FormData();
      formData.append("user", updateProfile2.files[0]);
      updateProfileHelper2(formData,id);
    })
  }
}
async function delElementHelper(id,type){
  let response=await axios.delete(`/api/${type}s/delete/${id}`)
  if (response.data.success) {
    alert(`${type} deleted!`)
    location.reload();
  }else{
    alert("Something went wrong");
  }
}
if (delElement){
  Object.keys(delElement).forEach(function(key){
    const id=delElement[key].getAttribute('uid');
    const type=delElement[key].getAttribute('type');
    delElement[key].addEventListener("click",function(e){
      e.preventDefault();
      if (confirm(`Are you sure you want to delete this ${type}?`)) {
        delElementHelper(id,type);
      }
    })
  })
}

async function payementHelper(planId) {
  console.log("I helper")
  const response = await axios.post("/api/bookings/createSession", { planId });
  if (response.data.status) {
    const { session } = response.data;
    const id = session.id;
    stripe.redirectToCheckout({
      sessionId: id
    }).then(function (result) {
      alert(result.error.message);
    });

  } else {
    alert("Payment failed");
  }
}

if (paymentBtn) {
  paymentBtn.addEventListener("click", function (e) {
    console.log("after clicking payment")
    e.preventDefault();
    const planId = paymentBtn.getAttribute("plan-id");
    payementHelper(planId);
  })
}