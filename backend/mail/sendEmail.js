const nodemailer = require("nodemailer");
require("dotenv").config();

exports.passwordResetEmail = (emailData) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  return transporter
    .sendMail(emailData)
    .then((info) => console.log(`Email sent: ${info.messageId}`))
    .catch((err) => console.log(`There is an error: ${err}`));
};
