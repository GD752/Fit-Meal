//  email,password ,request backend=> reply
let d = document;
let loginBtn = d.querySelector(".login-button");
let signupForm = d.querySelector(".signup");
let logoutBtn = d.querySelector(".logout");
let forgetForm = d.querySelector(".forgetPassword");
let resetPasswordForm = d.querySelector(".resetPassword");
let updateMyInfo=d.querySelector(".updateMyInfo")
let updateUserInfo=d.querySelector(".updateUserInfo")

let updateProfile = d.querySelector(".updateProfile");
let updateProfile2 = d.querySelector(".updateProfile2");
let delUser=d.querySelectorAll(".delicon")

async function loginHelper(email, password) {
  const response = await axios.post("/api/users/login", {
    email, password
  })
  console.log(response.data);
  if (response.data.status == "successfull") {
    alert("Login Successfull")
    location.assign("/profilePage");
  } else {
    alert("User ID or password is incorrect!");
  }
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
async function updateUserHelper(email,name,role,id){
  console.log("Frontend update user helper")
  const response = await axios.patch(`/api/users/updateUser/${id}`, { email,name,role });
  if (response.data.success) {
    alert("information updated")
    location.reload();
  }else{
    alert("something went wrong");
  }
}

if (updateUserInfo){
  let id=d.querySelector("[name=name1]").getAttribute('uid')
  updateUserInfo.addEventListener("submit",function(e){
    e.preventDefault();
    let email=d.querySelector("[name=email1]").value
    let name=d.querySelector("[name=name1]").value
    let role=d.querySelector("[name=role1]").value
    if(email&&name&&role)
      updateUserHelper(email,name,role,id)
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
async function delUserHelper(id){
  let response=await axios.delete(`/api/users/delete/${id}`)
  if (response.data.success) {
    alert("User Deleted")
    location.reload();
  }else{
    alert("something went wrong");
  }
}
if (delUser){
  console.log(delUser)
  Object.keys(delUser).forEach(function(key){
    const id=delUser[key].getAttribute('uid');
    console.log("In deluser")
    delUser[key].addEventListener("click",function(e){
      e.preventDefault();
      console.log("In click event listener")
      if (confirm("Are you sure you want to delete this user?")) {
        delUserHelper(id);
      } else {
        txt = "Not Deleted User";
      }
  })
  })
  
}