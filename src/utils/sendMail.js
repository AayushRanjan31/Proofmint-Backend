const nodemailer = require("nodemailer");
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    pass: config.SENDGRID_API_KEY,
  },
});

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const info = await transporter.sendMail({
      from: config.SENDGRID_FROM,
      to,
      subject,
      text,
      ...(html && { html }),
    });
    return info;
  } catch (error) {
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
