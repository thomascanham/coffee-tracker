import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  requireTLS: port !== 465, // Enforce STARTTLS on non-465 ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.PASSWORD_RESET_URL}?token=${token}`;

  await transporter.sendMail({
    from: `"Bean Log" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your Bean Log password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2a1810; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #5a3520; line-height: 1.6;">
          We received a request to reset your Bean Log password. Click the button below to choose a new one. This link will expire in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 32px; background-color: #d44d21; color: #fefdfb; text-decoration: none; border-radius: 9999px; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #8a5629; font-size: 14px; line-height: 1.6;">
          If you didn&rsquo;t request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
