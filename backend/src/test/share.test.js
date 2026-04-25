const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Idea = require("../models/Idea");
const SharedLink = require("../models/SharedLink");
const jwt = require("jsonwebtoken");

describe("Idea Sharing Endpoints", () => {
  let user;
  let token;
  let idea;

  beforeEach(async () => {
    // Setup user and token
    user = await User.create({
      name: "Share Tester",
      email: `tester-${Date.now()}@example.com`,
      password: "password123",
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1d",
    });

    // Setup idea
    idea = await Idea.create({
      title: "Test Idea for Sharing",
      description: "This is a test idea description.",
      category: "Technology",
      owner: user._id,
      visibility: "private"
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Idea.deleteMany({});
    await SharedLink.deleteMany({});
  });

  describe("POST /api/share/create", () => {
    it("should create a shared link for the owner", async () => {
      const res = await request(app)
        .post("/api/share/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ideaId: idea._id,
          permissions: "view",
          expiresIn: 24
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("shareToken");
      expect(res.body.permissions).toEqual("view");
    });

    it("should fail if not owner or collaborator", async () => {
      const otherUser = await User.create({
        name: "Other User",
        email: `other-${Date.now()}@example.com`,
        password: "password123"
      });
      const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET || "secret");

      const res = await request(app)
        .post("/api/share/create")
        .set("Authorization", `Bearer ${otherToken}`)
        .send({
          ideaId: idea._id
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe("GET /api/share/:token", () => {
    it("should return idea data for a valid token", async () => {
      const sharedLink = await SharedLink.create({
        idea: idea._id,
        creator: user._id,
        permissions: "comment"
      });

      const res = await request(app)
        .get(`/api/share/${sharedLink.shareToken}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.idea.title).toEqual(idea.title);
      expect(res.body.permissions).toEqual("comment");
    });

    it("should return view-only for guests even if link has higher permissions", async () => {
      const sharedLink = await SharedLink.create({
        idea: idea._id,
        creator: user._id,
        permissions: "edit"
      });

      const res = await request(app).get(`/api/share/${sharedLink.shareToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.permissions).toEqual("view");
    });

    it("should fail for an invalid token", async () => {
      const res = await request(app).get("/api/share/invalidtoken");
      expect(res.statusCode).toEqual(404);
    });

    it("should fail for an expired link", async () => {
      const expiredLink = await SharedLink.create({
        idea: idea._id,
        creator: user._id,
        expiresAt: new Date(Date.now() - 1000) // 1 second ago
      });

      const res = await request(app).get(`/api/share/${expiredLink.shareToken}`);
      expect(res.statusCode).toEqual(410);
    });
  });

  describe("DELETE /api/share/:id", () => {
    it("should allow creator to revoke a link", async () => {
      const sharedLink = await SharedLink.create({
        idea: idea._id,
        creator: user._id
      });

      const res = await request(app)
        .delete(`/api/share/${sharedLink._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      
      const updatedLink = await SharedLink.findById(sharedLink._id);
      expect(updatedLink.isActive).toBe(false);
    });
  });
});
