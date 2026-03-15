const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("\n--- [MOCK EMAIL MODE] ---");
    console.warn("Recipient:", options.email);
    console.warn("OTP/Message:", options.message);
    console.warn("To send real emails, please configure SMTP settings in .env");
    console.warn("-------------------------\n");
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465, // Use SSL for 465, otherwise STARTTLS
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || "IdeaCollab"} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    await transporter.sendMail(message);
    console.log(`Email successfully sent to ${options.email}`);
  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
