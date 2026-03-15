// This is a mock SMS provider for demonstration.
// In a real application, you would integrate with Twilio, AWS SNS, etc.

const sendSMS = async (phone, message) => {
  console.log(`[SMS MOCK] To: ${phone}, Message: ${message}`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
};

module.exports = sendSMS;
