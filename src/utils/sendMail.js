const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: "apikey", // this is literally the word "apikey"
    pass: config.SENDGRID_API_KEY, // your actual SendGrid API key
  },
});

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const info = await transporter.sendMail({
      from: config.SENDGRID_FROM, // must be a verified sender in SendGrid
      to,
      subject,
      text,
      ...(html && { html }),
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;

