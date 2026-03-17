const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Idea = require("../models/Idea");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");

describe("Notification Security Fix", () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await User.create({
      name: "Kalyan",
      email: "kalyan@test.com",
      password: "password123"
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "mysecretkey123");
  });

  it("should prevent creating a self-notification", async () => {
    const idea = await Idea.create({
      title: "My Idea",
      description: "My description",
      category: "Tech",
      owner: user._id
    });

    // Directly call followUser on self (though controller has a check, we test the notification helper)
    // Actually, let's test via the controller endpoint if possible
    const res = await request(app)
      .put(`/api/users/${user._id}/follow`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400); // Controller should block self-follow
    
    const notifications = await Notification.find({ recipient: user._id });
    expect(notifications.length).toBe(0);
  });

  it("should not create notification when user likes their own idea", async () => {
    const idea = await Idea.create({
      title: "My Idea",
      description: "My description",
      category: "Tech",
      owner: user._id
    });

    await request(app)
      .put(`/api/ideas/${idea._id}/like`)
      .set("Authorization", `Bearer ${token}`);

    const notifications = await Notification.find({ recipient: user._id });
    expect(notifications.length).toBe(0);
  });
});
