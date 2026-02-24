// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'yjktechnologies.com',
  port: 465,
  secure: true,
  auth: {
    user: 'thiyagarajan.gm@yjktechnologies.com',
    pass: 'Welcome@123',
  },
});

module.exports = transporter;
