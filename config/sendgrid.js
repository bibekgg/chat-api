const config = require('./config');
// using SendGrid's v3 Node.js Library
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGrid);

module.exports = sgMail;