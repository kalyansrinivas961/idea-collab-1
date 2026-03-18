const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

// Mock AI for detection and translation
jest.mock("groq-sdk", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ 
            message: { 
              content: JSON.stringify({ detectedLanguage: "French", translation: "Hello world" }) 
            } 
          }]
        })
      }
    }
  }));
});

describe("AI Translation Assistant", () => {
  let user, token, message;

  beforeEach(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});

    user = await User.create({ 
      name: "User 1", 
      email: "u1@test.com", 
      password: "Password123!",
      translationPreferences: { autoTranslate: true, defaultLanguage: "English" }
    });
    
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret");

    message = await Message.create({
      sender: user._id,
      content: "Bonjour tout le monde"
    });
  });

  describe("POST /api/messages/:messageId/translate", () => {
    it("should detect language and translate message", async () => {
      const res = await request(app)
        .post(`/api/messages/${message._id}/translate`)
        .set("Authorization", `Bearer ${token}`)
        .send({ targetLanguage: "English" });

      expect(res.statusCode).toBe(200);
      expect(res.body.translation).toBe("Hello world");
      expect(res.body.detectedLanguage).toBe("French");

      // Verify caching in DB
      const updatedMessage = await Message.findById(message._id);
      expect(updatedMessage.detectedLanguage).toBe("French");
      expect(updatedMessage.translations.get("English")).toBe("Hello world");
    });
  });

  describe("PUT /api/messages/preferences", () => {
    it("should update user translation preferences", async () => {
      const res = await request(app)
        .put("/api/messages/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({ autoTranslate: false, defaultLanguage: "Spanish" });

      expect(res.statusCode).toBe(200);
      expect(res.body.preferences.autoTranslate).toBe(false);
      expect(res.body.preferences.defaultLanguage).toBe("Spanish");

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.translationPreferences.autoTranslate).toBe(false);
    });
  });
});
