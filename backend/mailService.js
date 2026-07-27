const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error(
      "EMAIL_USER and EMAIL_APP_PASSWORD must be configured for OTP delivery"
    );
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
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

  console.log("=================================");
  console.log("📧 sendOTP() started");
  console.log("To:", email);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "APP PASSWORD LENGTH:",
    process.env.EMAIL_APP_PASSWORD
      ? process.env.EMAIL_APP_PASSWORD.length
      : "NOT SET"
  );
  console.log("=================================");

  const mailer = getTransporter();
  console.log("✅ Transporter created");

  try {
    const info = await mailer.sendMail({
      from: `"TechWithTanziya Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Admin Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom:10px;">Admin Login OTP</h2>

          <p>Use the following OTP to log in:</p>

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            color:#2563eb;
            margin:20px 0;
          ">
            ${otp}
          </div>

          <p>This OTP is valid for <strong>5 minutes</strong>.</p>

          <p>If you did not request this OTP, you can safely ignore this email.</p>

          <hr>

          <small>TechWithTanziya Admin Panel</small>
        </div>
      `,
    });

    console.log("✅ Email sent successfully");
    console.log(info.response);

    return info;
  } catch (err) {
    console.error("❌ sendMail failed");
    console.error(err);
    throw err;
  }
}

module.exports = sendOTP;