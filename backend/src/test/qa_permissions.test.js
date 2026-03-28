const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Problem = require("../models/Problem");
const Solution = require("../models/Solution");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Mock IDs
const mockAuthorId = new mongoose.Types.ObjectId();
const mockOtherId = new mongoose.Types.ObjectId();

// Mock protect middleware to inject users directly
jest.mock("../middleware/authMiddleware", () => ({
  protect: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.includes("authorToken")) {
      req.user = { _id: mockAuthorId, name: "Author" };
      return next();
    }
    if (authHeader && authHeader.includes("otherToken")) {
      req.user = { _id: mockOtherId, name: "Other" };
      return next();
    }
    res.status(401).json({ message: "Not authorized" });
  }
}));

// Mock Notification Controller to avoid database issues with notifications
jest.mock("../controllers/notificationController", () => ({
  createNotification: jest.fn().mockResolvedValue(true),
  getNotifications: (req, res) => res.json({ notifications: [] }),
  markAsRead: (req, res) => res.json({ message: "read" }),
  deleteNotifications: (req, res) => res.json({ message: "deleted" }),
  getUnreadCount: (req, res) => res.json({ count: 0 }),
}));

describe("Q&A Permission System", () => {
  let problem;
  const authorToken = "authorToken";
  const otherToken = "otherToken";

  beforeAll(async () => {
    // Clear DB
    await Problem.deleteMany({});
    await Solution.deleteMany({});

    // Create a problem with the mock author ID
    problem = await Problem.create({
      title: "Test Problem",
      description: "Test Description",
      category: "technical",
      author: mockAuthorId
    });
  });

  beforeEach(async () => {
    // Ensure problem exists and is fresh
    await Problem.deleteMany({});
    await Solution.deleteMany({});
    problem = await Problem.create({
      title: "Test Problem",
      description: "Test Description",
      category: "technical",
      author: mockAuthorId
    });
  });

  describe("Solution Creation Restriction (Rule 1)", () => {
    it("should prevent author from creating a top-level solution to their own problem", async () => {
      const res = await request(app)
        .post(`/api/qa/problems/${problem._id}/solutions`)
        .set("Authorization", `Bearer ${authorToken}`)
        .send({ problemId: problem._id, content: "My own solution" });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/cannot reply to your own question/);
    });

    it("should allow other users to create a solution", async () => {
      const res = await request(app)
        .post(`/api/qa/problems/${problem._id}/solutions`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ problemId: problem._id, content: "A valid solution" });

      expect(res.status).toBe(201);
    });
  });

  describe("Status Flag Control (Rule 3)", () => {
    it("should allow author to toggle status to solved", async () => {
      const res = await request(app)
        .patch(`/api/qa/problems/${problem._id}/status`)
        .set("Authorization", `Bearer ${authorToken}`)
        .send({ status: "solved" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("solved");
      expect(res.body.isResolved).toBe(true);
    });

    it("should prevent other users from toggling status", async () => {
      const res = await request(app)
        .patch(`/api/qa/problems/${problem._id}/status`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ status: "open" });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized/);
    });
  });

  describe("Reply Permission (Rule 2)", () => {
    let otherSolutionId;

    beforeEach(async () => {
      const sol = await Solution.create({
        problemId: problem._id,
        content: "Other user solution",
        author: mockOtherId
      });
      otherSolutionId = sol._id;
    });

    it("should allow author to reply to another user's solution", async () => {
      const res = await request(app)
        .post(`/api/qa/problems/${problem._id}/solutions`)
        .set("Authorization", `Bearer ${authorToken}`)
        .send({ 
          problemId: problem._id, 
          content: "Author's reply to solution", 
          parentReply: otherSolutionId 
        });

      expect(res.status).toBe(201);
      expect(res.body.parentReply.toString()).toBe(otherSolutionId.toString());
    });

    it("should prevent user from replying to their own reply", async () => {
      // First, create a reply by the author
      const authorReply = await Solution.create({
        problemId: problem._id,
        content: "Author's first reply",
        author: mockAuthorId,
        parentReply: otherSolutionId
      });
      
      const res = await request(app)
        .post(`/api/qa/problems/${problem._id}/solutions`)
        .set("Authorization", `Bearer ${authorToken}`)
        .send({ 
          problemId: problem._id, 
          content: "Replying to myself", 
          parentReply: authorReply._id 
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/cannot reply to your own response/);
    });
  });
});
