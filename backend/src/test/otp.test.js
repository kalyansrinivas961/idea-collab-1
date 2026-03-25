const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const EmailOtp = require("../models/EmailOtp");
const mongoose = require("mongoose");

// Mock SendGrid
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue(true),
}));

describe("OTP Workflow", () => {
  const testEmail = "otp-test@example.com";

  beforeEach(async () => {
    await User.deleteMany({});
    await EmailOtp.deleteMany({});
  });

  describe("POST /api/auth/send-otp", () => {
    it("should generate and send OTP for valid email", async () => {
      const res = await request(app)
        .post("/api/auth/send-otp")
        .send({ email: testEmail });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain("Verification code sent");

      const otpRecord = await EmailOtp.findOne({ email: testEmail });
      expect(otpRecord).toBeDefined();
      expect(otpRecord.otp).toHaveLength(6);
    });

    it("should fail for invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/send-otp")
        .send({ email: "invalid-email" });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain("valid email address is required");
    });

    it("should enforce rate limiting (1 minute cooldown)", async () => {
      // First request
      await request(app).post("/api/auth/send-otp").send({ email: testEmail });
      
      // Immediate second request
      const res = await request(app)
        .post("/api/auth/send-otp")
        .send({ email: testEmail });

      expect(res.statusCode).toEqual(429);
      expect(res.body.message).toContain("Please wait at least 60 seconds");
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should send OTP if user exists", async () => {
      await User.create({
        name: "OTP User",
        email: testEmail,
        password: "Password123!",
      });

      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: testEmail });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain("Verification code sent");

      const otpRecord = await EmailOtp.findOne({ email: testEmail });
      expect(otpRecord).toBeDefined();
    });

    it("should return generic success if user does not exist (security)", async () => {
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "nonexistent@example.com" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain("If an account exists");
      
      const otpRecord = await EmailOtp.findOne({ email: "nonexistent@example.com" });
      expect(otpRecord).toBeNull();
    });
  });

  describe("OTP Verification and Registration", () => {
    it("should verify OTP correctly", async () => {
      const otp = "123456";
      await EmailOtp.create({ email: testEmail, otp });

      const res = await request(app)
        .post("/api/auth/verify-otp")
        .send({ email: testEmail, otp });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Email verified successfully");
    });

    it("should fail for incorrect OTP", async () => {
      await EmailOtp.create({ email: testEmail, otp: "123456" });

      const res = await request(app)
        .post("/api/auth/verify-otp")
        .send({ email: testEmail, otp: "654321" });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain("Invalid or expired");
    });
  });
});
