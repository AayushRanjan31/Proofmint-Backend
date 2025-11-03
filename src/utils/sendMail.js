const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: config.userEmail,   
    pass: config.emailPassword,    
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000,
});

transporter.verify()
  .then(() => console.log('Mail transporter verified'))
  .catch(err => console.error('Mail transporter verification failed:', err));

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.userEmail,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return { ok: true, info };
  } catch (err) {
    console.error('Nodemailer send error:', err);
    if (err.response) console.error('Nodemailer response:', err.response);
    return { ok: false, message: err.message || 'Error sending email', raw: err };
  }
};

module.exports = sendEmail;
