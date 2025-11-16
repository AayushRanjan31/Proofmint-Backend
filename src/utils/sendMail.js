const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

const { SENDGRID_API_KEY, SENDGRID_FROM } = config;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

async function sendEmail(to, subject, text, html = null) {
  if (!SENDGRID_API_KEY) {
    return { ok: false, error: 'SENDGRID_API_KEY not configured' };
  }

  const msg = {
    to,
    from: SENDGRID_FROM,
    subject,
    text,
    ...(html && { html }),
  };

  try {
    const res = await sgMail.send(msg);
    const status = res && res[0] && res[0].statusCode;

    if (status >= 200 && status < 300) {
      return { ok: true, status, res };
    }
    return { ok: false, status, res };
  } catch (err) {
    return { ok: false, error: err };
  }
}

module.exports = sendEmail;
