const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Idea = require("../models/Idea");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

// Mock rate limiter
jest.mock("../middleware/rateLimiter", () => ({
  passwordChangeLimiter: (req, res, next) => next(),
}));

// Mock notification controller to avoid side effects
jest.mock("../controllers/notificationController", () => ({
  createNotification: jest.fn(),
  getNotifications: jest.fn((req, res) => res.json([])),
  getUnreadCount: jest.fn((req, res) => res.json({ count: 0 })),
  markAsRead: jest.fn((req, res) => res.json({ success: true })),
  deleteNotifications: jest.fn((req, res) => res.json({ success: true })),
}));

describe("Idea Endpoints", () => {
  let user;
  let otherUser;
  let token;
  let otherToken;
  let ideaId;

  beforeEach(async () => {
    // Create users
    user = await User.create({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123",
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "30d",
    });

    otherUser = await User.create({
      name: "Other User",
      email: "other@example.com",
      password: "password123",
    });
    otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "30d",
    });

    // Create a private idea owned by user
    const idea = await Idea.create({
      title: "Private Idea",
      description: "This is a private idea",
      category: "Tech",
      visibility: "private",
      allowedCommenters: "anyone",
      owner: user._id,
    });
    ideaId = idea._id;
  });

  describe("GET /api/ideas/:id", () => {
    it("should allow owner to view private idea", async () => {
      const res = await request(app)
        .get(`/api/ideas/${ideaId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual("Private Idea");
    });

    it("should deny other user from viewing private idea", async () => {
      const res = await request(app)
        .get(`/api/ideas/${ideaId}`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toEqual("You do not have permission to view this idea");
    });

    it("should deny guest from viewing private idea", async () => {
      const res = await request(app)
        .get(`/api/ideas/${ideaId}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toEqual("You do not have permission to view this idea");
    });

    it("should allow guest to view public idea", async () => {
        // Create public idea
        const publicIdea = await Idea.create({
            title: "Public Idea",
            description: "This is a public idea",
            category: "Tech",
            visibility: "public",
            allowedCommenters: "anyone",
            owner: user._id,
        });

        const res = await request(app)
            .get(`/api/ideas/${publicIdea._id}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("Public Idea");
    });
  });
});
