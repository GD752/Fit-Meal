const nodemailer = require("nodemailer");
const user1= process.env.EMAIL_ID||require("../configs/config").EMAIL_ID
const pass1= process.env.EMAIL_PASSWORD||require("../configs/config").EMAIL_PASSWORD
module.exports = async function emailSender(options) {
  //  1. transport => configuration
  // configurations set email
  const transport = nodemailer.createTransport({
    tls: {
      rejectUnauthorized: false
    },secure:false,
    service: "gmail",
    auth: {
      // email Id
      user: user1,
      // app password
      pass: pass1
    }
  });
  //2. parameters
  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html
  }
  // 3. sendMail
  await transport.sendMail(mailOptions);
}
