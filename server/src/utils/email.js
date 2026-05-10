import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (to, resetUrl) => {
  const transporter = getTransporter();

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2>AbilityMap Ghana – Password Reset</h2>
      <p>You requested to reset your password. Click the link below to set a new password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2c7a4d; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <p style="font-size: 12px;">AbilityMap Ghana – connecting disability support services</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset your AbilityMap password",
    html,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "📧 Message sent. Preview URL:",
      nodemailer.getTestMessageUrl(info),
    );
  }
};
