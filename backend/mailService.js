const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('EMAIL_USER and EMAIL_APP_PASSWORD must be configured for OTP delivery');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  return transporter;
}

async function sendOTP(email, otp) {
  if (!email) {
    throw new Error('Admin email is not configured');
  }

  const mailer = getTransporter();
  const info = await mailer.sendMail({
    from: `"TechWithTanziya Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Admin Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 8px;">Admin Login OTP</h2>
        <p style="margin: 0 0 16px;">Use this one-time password to complete your admin sign-in.</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 16px 0;">${otp}</div>
        <p style="margin: 0; color: #6b7280;">This OTP expires in 5 minutes. If you did not request this code, you can ignore this email.</p>
      </div>
    `
  });

  console.log('Email sent:', info.response);
  return info;
}

module.exports = sendOTP;