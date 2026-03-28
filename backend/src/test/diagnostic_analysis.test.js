const request = require("supertest");
const app = require("../server");
const Problem = require("../models/Problem");
const Solution = require("../models/Solution");
const User = require("../models/User");
const mongoose = require("mongoose");

// Mock IDs
const mockAuthorId = new mongoose.Types.ObjectId();
const mockOtherId = new mongoose.Types.ObjectId();

// Mock protect middleware
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

// Mock AI Service (Groq SDK)
jest.mock("groq-sdk", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Mocked AI Narrative Expansion Content" } }]
        })
      }
    }
  }));
});

// Mock Notification Controller
jest.mock("../controllers/notificationController", () => ({
  createNotification: jest.fn().mockResolvedValue(true),
  getNotifications: (req, res) => res.json({ notifications: [] }),
  markAsRead: (req, res) => res.json({ message: "read" }),
  deleteNotifications: (req, res) => res.json({ message: "deleted" }),
  getUnreadCount: (req, res) => res.json({ count: 0 }),
}));

describe("Comprehensive Diagnostic Analysis", () => {
  let problem;
  const authorToken = "authorToken";
  const otherToken = "otherToken";

  beforeAll(async () => {
    process.env.GROQ_API_KEY = "mock-groq-key";
    
    // Ensure DB is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ideacollab_test");
    }

    await Problem.deleteMany({});
    await Solution.deleteMany({});
    await User.deleteMany({});
    
    problem = await Problem.create({
      title: "Diagnostic Test Problem",
      description: "Original brief description",
      category: "technical",
      author: mockAuthorId
    });
  });

  describe("Task 1: AI-Powered Q&A Expansion", () => {
    it("should successfully expand a description via AI endpoint", async () => {
      const res = await request(app)
        .post("/api/ai/enhance-description")
        .set("Authorization", `Bearer ${authorToken}`)
        .send({
          text: "Help with React",
          mode: "expand",
          title: "Diagnostic Test Problem",
          category: "technical"
        });

      if (res.status !== 200) console.log("Expansion Error:", res.status, res.body);
      expect(res.status).toBe(200);
      expect(res.body.enhancedText).toBeDefined();
      expect(typeof res.body.enhancedText).toBe("string");
    });
  });

  describe("Task 2: Solution Creation Restriction", () => {
    it("should block the problem author from posting a top-level solution", async () => {
      const res = await request(app)
        .post(`/api/qa/problems/${problem._id}/solutions`)
        .set("Authorization", `Bearer ${authorToken}`)
        .send({ problemId: problem._id, content: "Attempting to solve my own problem" });

      if (res.status !== 403) console.log("Restriction Error:", res.status, res.body, "URL:", `/api/qa/problems/${problem._id}/solutions`);
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/cannot reply to your own question/);
    });

    it("should allow a non-author to post a solution", async () => {
      const res = await request(app)
        .post(`/api/qa/problems/${problem._id}/solutions`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ problemId: problem._id, content: "Valid solution from another user" });

      if (res.status !== 201) console.log("Solution Error:", res.status, res.body);
      expect(res.status).toBe(201);
    });
  });

  describe("Task 3: Status Flag Control", () => {
    it("should allow author to update status to solved", async () => {
      const res = await request(app)
        .patch(`/api/qa/problems/${problem._id}/status`)
        .set("Authorization", `Bearer ${authorToken}`)
        .send({ status: "solved" });

      if (res.status !== 200) console.log("Status Error:", res.status, res.body, "URL:", `/api/qa/problems/${problem._id}/status`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("solved");
      expect(res.body.isResolved).toBe(true);
    });

    it("should block non-authors from updating status", async () => {
      const res = await request(app)
        .patch(`/api/qa/problems/${problem._id}/status`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ status: "open" });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Not authorized/);
    });
  });
});
