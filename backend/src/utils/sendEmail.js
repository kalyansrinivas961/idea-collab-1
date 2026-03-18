const sgMail = require("@sendgrid/mail");

const sendEmail = async (options) => {
  // Check if SendGrid is configured
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === "YOUR_SENDGRID_API_KEY_HERE") {
    console.warn("\n--- [MOCK EMAIL MODE] ---");
    console.warn("Recipient:", options.email);
    console.warn("OTP/Message:", options.message);
    console.warn("To send real emails, please configure SENDGRID_API_KEY in .env");
    console.warn("-------------------------\n");
    return true; // Return true to not block OTP flow in dev
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: {
      name: process.env.FROM_NAME || "IdeaCollab",
      email: process.env.FROM_EMAIL, // Use your verified sender email
    },
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`[EMAIL SUCCESS] Sent to ${options.email} via SendGrid`);
    return true;
  } catch (error) {
    console.error("[SENDGRID ERROR]", error.response?.body || error.message);
    throw new Error("Failed to send email via SendGrid");
  }
};

module.exports = sendEmail;
