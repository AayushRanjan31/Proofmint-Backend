// services/sendgrid-mail.js
const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, SENDGRID_FROM, NODE_ENV } = process.env;

// sanity check
if (!SENDGRID_API_KEY) {
  console.warn('⚠️ SENDGRID_API_KEY not set - SendGrid disabled');
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized');
}

/**
 * sendEmail - use SendGrid HTTP API (works on Railway)
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} [html]
 */
async function sendEmail(to, subject, text, html = null) {
  if (!SENDGRID_API_KEY) {
    return { ok: false, error: 'SENDGRID_API_KEY not configured' };
  }

  const msg = {
    to,
    from: SENDGRID_FROM, // must be verified sender e.g. prfmntscrt@gmail.com
    subject,
    text,
    ...(html && { html }),
  };

  try {
    const res = await sgMail.send(msg); // returns array of responses
    const status = res && res[0] && res[0].statusCode;
    if (status >= 200 && status < 300) {
      if (NODE_ENV !== 'production') console.log('SendGrid ok', status);
      return { ok: true, status, res };
    }
    return { ok: false, status, res };
  } catch (err) {
    console.error('SendGrid error:', err && (err.message || err.toString()));
    if (err && err.response && err.response.body) {
      console.error('SendGrid response body:', err.response.body);
    }
    return { ok: false, error: err };
  }
}

module.exports = sendEmail;

