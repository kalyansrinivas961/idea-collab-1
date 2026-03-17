const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;

  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("\n--- [MOCK EMAIL MODE] ---");
    console.warn("Recipient:", options.email);
    console.warn("OTP/Message:", options.message);
    console.warn("To send real emails, please configure SMTP settings in .env");
    console.warn("-------------------------\n");
    return true;
  }

  // Create transporter with timeout and pool
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,   // 5 seconds
    socketTimeout: 15000,    // 15 seconds
  });

  const message = {
    from: `${process.env.FROM_NAME || "IdeaCollab"} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  const attemptSend = async () => {
    try {
      await transporter.sendMail(message);
      console.log(`[EMAIL SUCCESS] Sent to ${options.email} (Attempt ${retryCount + 1})`);
      return true;
    } catch (error) {
      retryCount++;
      console.error(`[EMAIL ERROR] Attempt ${retryCount} failed for ${options.email}:`, error.message);
      
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return attemptSend();
      }
      throw error;
    }
  };

  return attemptSend();
};

module.exports = sendEmail;
