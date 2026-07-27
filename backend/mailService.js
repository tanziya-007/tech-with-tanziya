const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error("EMAIL_USER and EMAIL_APP_PASSWORD must be configured for OTP delivery");
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  return transporter;
}

async function sendOTP(email, otp) {
  if (!email) {
    throw new Error("Admin email is not configured");
  }

  console.log("📧 sendOTP() started");
  console.log("To:", email);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "APP PASSWORD LENGTH:",
    process.env.EMAIL_APP_PASSWORD
      ? process.env.EMAIL_APP_PASSWORD.length
      : "NOT SET"
  );

  const mailer = getTransporter();
  console.log("✅ Transporter created");

  try {
    const info = await mailer.sendMail({
      from: `"TechWithTanziya Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Admin Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Admin Login OTP</h2>
          <p>Your OTP is:</p>
          <div style="font-size:32px;font-weight:bold;">${otp}</div>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ sendMail failed");
    console.error(err);
    throw err;
  }
}

module.exports = sendOTP;