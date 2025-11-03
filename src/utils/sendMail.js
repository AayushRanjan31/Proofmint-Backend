const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SENDGRID_FROM,
      to,
      subject,
      text,
      ...(html && { html }),
    });
    console.log(`Email sent to ${to}`);
    return info;
  } catch (error) {
    console.error("SendGrid error:", error);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
