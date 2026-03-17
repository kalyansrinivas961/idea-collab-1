const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

// Mock rate limiter to avoid hitting limits during tests
jest.mock("../middleware/rateLimiter", () => ({
  passwordChangeLimiter: (req, res, next) => next(),
}));

describe("Auth Endpoints", () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "30d",
    });
  });

  describe("PUT /api/auth/password", () => {
    it("should update password with valid data", async () => {
      const res = await request(app)
        .put("/api/auth/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "password123",
          newPassword: "NewPassword1!",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Password updated successfully");

      // Verify password changed
      const updatedUser = await User.findById(user._id);
      const isMatch = await updatedUser.matchPassword("NewPassword1!");
      expect(isMatch).toBe(true);
    });

    it("should fail with incorrect current password", async () => {
      const res = await request(app)
        .put("/api/auth/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "wrongpassword",
          newPassword: "NewPassword1!",
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual("Invalid current password");
    });

    it("should fail if new password does not meet complexity requirements", async () => {
      const res = await request(app)
        .put("/api/auth/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "password123",
          newPassword: "weak",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain("Password must be at least 8 characters");
    });
  });
});
