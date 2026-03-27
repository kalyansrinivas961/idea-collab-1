const sgMail = require("@sendgrid/mail");

/**
 * Send email using SendGrid API
 * @param {Object} options - Email options (email, subject, message, html)
 */
const sendEmail = async (options) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;

  // Configure SendGrid with API Key
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("\n--- [MOCK EMAIL MODE] ---");
    console.warn("Recipient:", options.email);
    console.warn("Message:", options.message);
    console.warn("To send real emails, please configure SENDGRID_API_KEY in .env");
    console.warn("-------------------------\n");
    return true;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: {
      email: process.env.FROM_EMAIL || "noreply@ideacollab.com",
      name: process.env.FROM_NAME || "IdeaCollab"
    },
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  const attemptSend = async () => {
    try {
      await sgMail.send(msg);
      console.log(`[SENDGRID SUCCESS] Email sent to ${options.email} (Attempt ${retryCount + 1})`);
      return true;
    } catch (error) {
      retryCount++;
      const errorMessage = error.response ? error.response.body : error.message;
      console.error(`[SENDGRID ERROR] Attempt ${retryCount} failed for ${options.email}:`, errorMessage);
      
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
      console.warn("Error:", errorMessage);
      console.warn("---------------------------------------\n");
      
      return false;
    }
  };

  return attemptSend();
};

module.exports = sendEmail;
