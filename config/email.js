const nodemailer = require("nodemailer");
require('dotenv').config();
const env = process.env;

const smtpTransport = nodemailer.createTransport({
  service: "naver",
  host: "smtp.naver.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// 내보내기
module.exports = {
  smtpTransport,
};