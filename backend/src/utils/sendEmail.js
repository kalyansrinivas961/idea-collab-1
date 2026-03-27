const nodemailer = require("nodemailer");

/**
 * Send email using Brevo (formerly Sendinblue) via SMTP or API
 * @param {Object} options - Email options (email, subject, message, html)
 */
const sendEmail = async (options) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;

  // Use SMTP settings if available, otherwise check for API key
  const hasSmtpSettings = process.env.BREVO_SMTP_SERVER && process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS;
  
  if (!hasSmtpSettings && !process.env.BREVO_API_KEY) {
    console.warn("\n--- [MOCK EMAIL MODE] ---");
    console.warn("Recipient:", options.email);
    console.warn("Message:", options.message);
    console.warn("To send real emails, please configure BREVO_SMTP settings or BREVO_API_KEY in .env");
    console.warn("-------------------------\n");
    return true;
  }

  // Create transporter using SMTP (Standard way for transactional emails)
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_SERVER || "smtp-relay.brevo.com",
    port: parseInt(process.env.BREVO_SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS || process.env.BREVO_API_KEY,
    },
  });

  if (!process.env.BREVO_SMTP_USER || (!process.env.BREVO_SMTP_PASS && !process.env.BREVO_API_KEY)) {
    console.error("\n--- [SMTP CONFIGURATION ERROR] ---");
    console.error("Missing BREVO_SMTP_USER, BREVO_SMTP_PASS, or BREVO_API_KEY.");
    console.error("Please configure these in your .env file.");
    console.error("----------------------------------\n");
    throw new Error("Brevo SMTP credentials are not configured.");
  }

  const mailOptions = {
    from: `"${process.env.FROM_NAME || "IdeaCollab"}" <${process.env.FROM_EMAIL || "ak.srinivas961@gmail.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  const attemptSend = async () => {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[BREVO SMTP SUCCESS] Email sent to ${options.email} (Attempt ${retryCount + 1})`);
      return true;
    } catch (error) {
      retryCount++;
      console.error(`[BREVO SMTP ERROR] Attempt ${retryCount} failed for ${options.email}:`, error.message);
      
      if (retryCount < MAX_RETRIES) {
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return attemptSend();
      }
      
      // Fallback mechanism: log to console if all retries fail
      console.warn("\n--- [FALLBACK: EMAIL FAILED TO SEND] ---");
      console.warn("Recipient:", options.email);
      console.warn("Content:", options.message);
      console.warn("Error:", error.message);
      console.warn("---------------------------------------\n");
      
      return false;
    }
  };

  return attemptSend();
};

module.exports = sendEmail;
