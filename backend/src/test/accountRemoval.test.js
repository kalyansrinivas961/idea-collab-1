const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const jwt = require("jsonwebtoken");

describe("Account Removal (Followers/Following) Features", () => {
  let userA;
  let userB;
  let tokenA;
  let tokenB;

  beforeEach(async () => {
    userA = await User.create({
      name: "User A",
      email: "usera@test.com",
      password: "password123",
      following: [],
      followers: []
    });
    tokenA = jwt.sign({ id: userA._id }, process.env.JWT_SECRET || "mysecretkey123");

    userB = await User.create({
      name: "User B",
      email: "userb@test.com",
      password: "password123",
      following: [],
      followers: []
    });
    tokenB = jwt.sign({ id: userB._id }, process.env.JWT_SECRET || "mysecretkey123");

    // Establish follow relationship: A follows B
    userA.following.push(userB._id);
    userB.followers.push(userA._id);
    await userA.save();
    await userB.save();
  });

  it("should allow user A to unfollow user B explicitly", async () => {
    const res = await request(app)
      .delete(`/api/users/${userB._id}/unfollow`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    
    const updatedA = await User.findById(userA._id);
    const updatedB = await User.findById(userB._id);
    
    expect(updatedA.following).not.toContainEqual(userB._id);
    expect(updatedB.followers).not.toContainEqual(userA._id);

    // Check activity log
    const log = await ActivityLog.findOne({ user: userA._id, action: "unfollow", targetUser: userB._id });
    expect(log).toBeDefined();
  });

  it("should allow user B to remove user A as a follower", async () => {
    const res = await request(app)
      .delete(`/api/users/${userA._id}/follower`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    
    const updatedA = await User.findById(userA._id);
    const updatedB = await User.findById(userB._id);
    
    expect(updatedA.following).not.toContainEqual(userB._id);
    expect(updatedB.followers).not.toContainEqual(userA._id);

    // Check activity log
    const log = await ActivityLog.findOne({ user: userB._id, action: "remove_follower", targetUser: userA._id });
    expect(log).toBeDefined();
  });

  it("should enforce rate limiting on relationship actions", async () => {
    // Relationship limiter is set to 10 per minute
    for (let i = 0; i < 10; i++) {
      await request(app)
        .delete(`/api/users/${userB._id}/unfollow`)
        .set("Authorization", `Bearer ${tokenA}`);
    }

    const res = await request(app)
      .delete(`/api/users/${userB._id}/unfollow`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(429); // Too Many Requests
  });
});
