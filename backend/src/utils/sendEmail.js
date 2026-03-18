const sgMail = require("@sendgrid/mail");

const sendEmail = async (options) => {
  const MAX_RETRIES = 3;
  let attempt = 0;

  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === "YOUR_SENDGRID_API_KEY_HERE") {
    console.warn("\n--- [MOCK EMAIL MODE] ---");
    console.warn(`Recipient: ${options.email}, Subject: ${options.subject}`);
    console.warn(`Message: ${options.message}`);
    console.warn("-------------------------\n");
    return true;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: {
      name: process.env.FROM_NAME || "IdeaCollab",
      email: process.env.FROM_EMAIL,
    },
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  while (attempt < MAX_RETRIES) {
    try {
      await sgMail.send(msg);
      console.log(`[EMAIL SUCCESS] Sent to ${options.email} via SendGrid (Attempt ${attempt + 1})`);
      return true;
    } catch (error) {
      attempt++;
      console.error(`[SENDGRID ERROR] Attempt ${attempt} failed for ${options.email}:`);
      if (error.response) {
        console.error("Detailed SendGrid Response:", JSON.stringify(error.response.body, null, 2));
      }
      
      if (attempt >= MAX_RETRIES) {
        throw new Error("Failed to send email via SendGrid after multiple attempts.");
      }
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = sendEmail;
