const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const EmailOtp = require("../models/EmailOtp");

// Mock SendGrid
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue(true),
}));

describe("SendGrid OTP & Password Recovery Workflow", () => {
  const testEmail = "recovery-test@example.com";
  const testPassword = "Password123!";

  beforeAll(async () => {
    process.env.SENDGRID_API_KEY = "SG.test_key";
    process.env.FROM_EMAIL = "test@ideacollab.com";
    await User.deleteMany({});
    await EmailOtp.deleteMany({});
    
    // Create a test user
    await User.create({
      name: "Test User",
      email: testEmail,
      password: "OldPassword123!",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await EmailOtp.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should generate OTP and send email via SendGrid", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: testEmail });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain("Verification code sent");

      // Check database directly
      const allOtps = await EmailOtp.find({});
      console.log("All OTPs in DB:", allOtps);

      const otpRecord = await EmailOtp.findOne({ email: testEmail });
      expect(otpRecord).toBeDefined();
      expect(otpRecord).not.toBeNull();
      expect(otpRecord.otp).toHaveLength(6);
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should reset password with valid OTP", async () => {
      // Ensure user exists
      let user = await User.findOne({ email: testEmail });
      if (!user) {
        user = await User.create({
          name: "Test User",
          email: testEmail,
          password: "OldPassword123!",
        });
      }

      // Step 1: Create OTP directly in DB
      const testOtp = "123456";
      await EmailOtp.findOneAndUpdate(
        { email: testEmail },
        { otp: testOtp, createdAt: Date.now() },
        { upsert: true }
      );

      // Step 2: Reset password
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          email: testEmail,
          otp: testOtp,
          newPassword: testPassword,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain("successfully");

      // Verify OTP is cleaned up
      const remainingOtp = await EmailOtp.findOne({ email: testEmail });
      expect(remainingOtp).toBeNull();
    });

    it("should fail with invalid OTP", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({
          email: testEmail,
          otp: "000000",
          newPassword: "NewPassword123!",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain("Invalid");
    });
  });
});
