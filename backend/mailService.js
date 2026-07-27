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
    throw new Error("Admin email is not configured");
  }

  console.log("📧 sendOTP() started");
  console.log("To:", email);

  const mailer = getTransporter();
  console.log("✅ Transporter created");

  const info = await mailer.sendMail({
    from: `"TechWithTanziya Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Admin Login OTP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Admin Login OTP</h2>
        <p>Your OTP is:</p>
        <div style="font-size:32px;font-weight:bold;">${otp}</div>
      </div>
    `
  });

  console.log("✅ Email sent:", info.response);

  return info;
}

module.exports = sendOTP;