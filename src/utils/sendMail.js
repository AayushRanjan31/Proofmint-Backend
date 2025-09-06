const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nayinisaivenkat22@gmail.com',
    pass: 'vccixluntmmqvnlg',
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'nayinisaivenkat22@gmail.com',
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
