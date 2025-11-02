const nodemailer = require('nodemailer');
const config = require('../config/config'); // make sure this reads from process.env

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: config.userEmail,         // process.env.USER_EMAIL
    pass: config.emailPassword,     // process.env.EMAIL_PASSWORD (App Password if 2FA)
  },
  tls: {
    // do not fail on invalid certs (only if you must)
    rejectUnauthorized: false
  }
});

// verify transporter during startup and log
transporter.verify()
  .then(() => console.log('✅ Mail transporter verified'))
  .catch(err => console.error('❌ Mail transporter verification failed:', err));

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: config.userEmail,
      to,
      subject,
      text,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (err) {
    console.error('Error sending email:', err); // log full error to Railway logs
    throw err; // rethrow so calling code can handle it (and you can see real message)
  }
};

module.exports = sendEmail;
