const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTP(email, otp) {
  if (!email) {
    throw new Error("Admin email is not configured");
  }

  console.log("=================================");
  console.log("📧 sendOTP() started");
  console.log("To:", email);
  console.log("=================================");

  try {
    const { data, error } = await resend.emails.send({
      from: "TechWithTanziya <onboarding@resend.dev>",
      to: email,
      subject: "Your Admin Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2 style="color:#2563eb;">TechWithTanziya Admin Login</h2>

          <p>Hello,</p>

          <p>Your One-Time Password (OTP) is:</p>

          <div style="
            font-size:36px;
            font-weight:bold;
            letter-spacing:8px;
            color:#111827;
            background:#f3f4f6;
            padding:20px;
            border-radius:8px;
            text-align:center;
          ">
            ${otp}
          </div>

          <p style="margin-top:20px;">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p>If you didn't request this login, you can safely ignore this email.</p>

          <hr>

          <p style="color:#6b7280;font-size:13px;">
            © TechWithTanziya
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent successfully");
    console.log(data);

    return data;
  } catch (err) {
    console.error("❌ sendOTP failed");
    console.error(err);
    throw err;
  }
}

module.exports = sendOTP;