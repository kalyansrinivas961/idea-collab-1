const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Mock auth middleware
jest.mock("../middleware/authMiddleware", () => ({
  protect: (req, res, next) => {
    req.user = { _id: "dummyUserId" };
    next();
  },
}));

describe("AI Chat API", () => {
  it("should return a greeting response", async () => {
    const res = await request(app)
      .post("/api/ai/chat")
      .send({ message: "Hello" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toContain("IdeaCollab assistant");
  });

  it("should return password help", async () => {
    const res = await request(app)
      .post("/api/ai/chat")
      .send({ message: "How do I change my password?" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toContain("change your password");
  });

  it("should return default response for unknown query", async () => {
    const res = await request(app)
      .post("/api/ai/chat")
      .send({ message: "What is the meaning of life?" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toContain("simulation mode");
  });

  it("should require a message", async () => {
    const res = await request(app)
      .post("/api/ai/chat")
      .send({});

    expect(res.statusCode).toEqual(400);
  });
});
