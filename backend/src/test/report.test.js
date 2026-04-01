const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Idea = require("../models/Idea");
const Report = require("../models/Report");
const jwt = require("jsonwebtoken");

describe("Reporting Workflow", () => {
  let userToken;
  let adminToken;
  let ideaId;
  let userId;
  let adminId;

  beforeEach(async () => {
    // Create Users
    const user = await User.create({
      name: "Test User",
      email: "user@test.com",
      password: "password123",
      role: "user"
    });
    userId = user._id;
    userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "mysecretkey123");

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "password123",
      role: "admin"
    });
    adminId = admin._id;
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "mysecretkey123");

    // Create Idea
    const idea = await Idea.create({
      title: "Suspicious Idea",
      description: "Something is wrong here.",
      category: "Tech",
      owner: adminId // Owned by someone else
    });
    ideaId = idea._id;
  });

  describe("POST /api/reports", () => {
    it("should fail if context is less than 50 characters", async () => {
      const res = await request(app)
        .post("/api/reports")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          ideaId,
          category: "spam",
          context: "Too short"
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("at least 50 characters");
    });

    it("should create a report if valid", async () => {
      const validContext = "a".repeat(51);
      const res = await request(app)
        .post("/api/reports")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          ideaId,
          category: "spam",
          context: validContext
        });

      expect(res.status).toBe(201);
      expect(res.body.referenceNumber).toBeDefined();
      expect(res.body.referenceNumber).toMatch(/^REP-/);
      
      const report = await Report.findOne({ referenceNumber: res.body.referenceNumber });
      expect(report).toBeDefined();
      expect(report.category).toBe("spam");
    });

    it("should prevent duplicate reports within 24 hours", async () => {
      const validContext = "a".repeat(51);
      
      // First report
      await request(app)
        .post("/api/reports")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          ideaId,
          category: "spam",
          context: validContext
        });

      // Second report immediately
      const res = await request(app)
        .post("/api/reports")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          ideaId,
          category: "harassment",
          context: validContext
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("already reported this idea");
    });
  });

  describe("GET /api/reports", () => {
    it("should prevent non-admins from accessing reports", async () => {
      const res = await request(app)
        .get("/api/reports")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it("should allow admins to get all reports", async () => {
      const longContext = "a".repeat(501);
      await Report.create({
        reporter: userId,
        idea: ideaId,
        category: "spam",
        context: longContext,
        referenceNumber: "REP-TEST1"
      });

      const res = await request(app)
        .get("/api/reports")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].referenceNumber).toBe("REP-TEST1");
    });
  });
});
