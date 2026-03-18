const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const jwt = require("jsonwebtoken");

// Mock AI for translation
jest.mock("groq-sdk", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Translated Text" } }]
        })
      }
    }
  }));
});

describe("Message Interaction System", () => {
  let user, otherUser, token, message;

  beforeEach(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});

    user = await User.create({ name: "User 1", email: "u1@test.com", password: "Password123!" });
    otherUser = await User.create({ name: "User 2", email: "u2@test.com", password: "Password123!" });
    
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret");

    message = await Message.create({
      sender: user._id,
      receiver: otherUser._id,
      content: "Original Message"
    });
  });

  describe("PUT /api/messages/:messageId (Edit)", () => {
    it("should allow sender to edit message", async () => {
      const res = await request(app)
        .put(`/api/messages/${message._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Updated Message" });

      expect(res.statusCode).toBe(200);
      expect(res.body.content).toBe("Updated Message");
      expect(res.body.isEdited).toBe(true);
    });

    it("should prevent non-sender from editing", async () => {
      const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET || "secret");
      const res = await request(app)
        .put(`/api/messages/${message._id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ content: "Hacked" });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("POST /api/messages (Reply)", () => {
    it("should support threaded replies", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${token}`)
        .send({ 
          receiverId: otherUser._id, 
          content: "This is a reply", 
          replyTo: message._id 
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.replyTo._id).toBe(message._id.toString());
    });
  });

  describe("POST /api/messages/:messageId/translate", () => {
    it("should translate message content", async () => {
      const res = await request(app)
        .post(`/api/messages/${message._id}/translate`)
        .set("Authorization", `Bearer ${token}`)
        .send({ targetLanguage: "Spanish" });

      expect(res.statusCode).toBe(200);
      expect(res.body.translation).toBe("Translated Text");
    });
  });
});
