const nodemailer = require('nodemailer');
const config = require('../config/config');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.userEmail,
    pass: config.emailPassword,
  },
});
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: config.userEmail,
      to,
      subject,
      text,
    });
    return true;
  } catch {
    throw new Error('Error sending email');
  }
};
module.exports = sendEmail;
