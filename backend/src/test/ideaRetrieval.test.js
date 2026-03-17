const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Idea = require("../models/Idea");
const jwt = require("jsonwebtoken");

describe("Idea Retrieval Workflow", () => {
  let user;
  let token;
  let otherUser;

  beforeEach(async () => {
    // Create users
    user = await User.create({
      name: "Test User",
      email: "test@test.com",
      password: "password123",
      following: []
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "mysecretkey123");

    otherUser = await User.create({
      name: "Other User",
      email: "other@test.com",
      password: "password123",
      following: []
    });

    // Create ideas with different visibilities
    await Idea.create([
      {
        title: "Public Idea",
        description: "Public description",
        category: "Tech",
        visibility: "public",
        owner: otherUser._id
      },
      {
        title: "Connections Idea",
        description: "Connections description",
        category: "Tech",
        visibility: "connections",
        owner: otherUser._id
      },
      {
        title: "Private Idea",
        description: "Private description",
        category: "Tech",
        visibility: "private",
        owner: otherUser._id
      },
      {
        title: "Own Private Idea",
        description: "My private idea",
        category: "Tech",
        visibility: "private",
        owner: user._id
      }
    ]);
  });

  describe("GET /api/ideas", () => {
    it("should return only public ideas for unauthenticated users", async () => {
      const res = await request(app).get("/api/ideas");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe("Public Idea");
    });

    it("should return public ideas and own ideas for authenticated users", async () => {
      const res = await request(app)
        .get("/api/ideas")
        .set("Authorization", `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      const titles = res.body.map(i => i.title);
      expect(titles).toContain("Public Idea");
      expect(titles).toContain("Own Private Idea");
      expect(titles).not.toContain("Connections Idea");
      expect(titles).not.toContain("Private Idea");
    });

    it("should return connections ideas if user follows the owner", async () => {
      // User follows otherUser
      user.following.push(otherUser._id);
      await user.save();

      const res = await request(app)
        .get("/api/ideas")
        .set("Authorization", `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      const titles = res.body.map(i => i.title);
      expect(titles).toContain("Public Idea");
      expect(titles).toContain("Own Private Idea");
      expect(titles).toContain("Connections Idea");
      expect(titles).not.toContain("Private Idea");
    });

    it("should filter by search query", async () => {
      const res = await request(app).get("/api/ideas?search=Public");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe("Public Idea");
    });

    it("should filter by category", async () => {
      const res = await request(app).get("/api/ideas?category=Tech");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1); // Only Public Idea for Guest
    });
  });
});
