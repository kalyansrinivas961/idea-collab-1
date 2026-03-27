const mongoose = require("mongoose");
const User = require("../models/User");

describe("User Activity Tracking Logic", () => {
  let idleUser, activeUser;

  beforeEach(async () => {
    await User.deleteMany({});

    const thirtyOneMinutesAgo = new Date(Date.now() - 31 * 60 * 1000);
    const sixteenMinutesAgo = new Date(Date.now() - 16 * 60 * 1000);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Create an offline user (online but last active > 30m ago)
    idleUser = await User.create({
      name: "Offline User",
      email: "offline@test.com",
      isOnline: true,
      presenceStatus: "online",
      lastActive: thirtyOneMinutesAgo
    });

    // Create an away user (online but last active > 15m ago)
    await User.create({
      name: "Away User",
      email: "away@test.com",
      isOnline: true,
      presenceStatus: "online",
      lastActive: sixteenMinutesAgo
    });

    // Create an active user (online and last active < 15m ago)
    activeUser = await User.create({
      name: "Active User",
      email: "active@test.com",
      isOnline: true,
      presenceStatus: "online",
      lastActive: fiveMinutesAgo
    });
  });

  it("should identify users who have been idle for more than 15 minutes but less than 30", async () => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const awayUsers = await User.find({ 
      presenceStatus: "online", 
      lastActive: { $lt: fifteenMinutesAgo, $gt: thirtyMinutesAgo } 
    });

    expect(awayUsers.length).toBe(1);
    expect(awayUsers[0].name).toBe("Away User");
  });

  it("should identify users who have been idle for more than 30 minutes", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const offlineUsers = await User.find({ 
      isOnline: true, 
      lastActive: { $lt: thirtyMinutesAgo } 
    });

    expect(offlineUsers.length).toBe(1);
    expect(offlineUsers[0].name).toBe("Offline User");
  });

  it("should mark idle users as offline while keeping active users online", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const idleUsers = await User.find({ 
      isOnline: true, 
      lastActive: { $lt: thirtyMinutesAgo } 
    });

    if (idleUsers.length > 0) {
      await User.updateMany(
        { _id: { $in: idleUsers.map(u => u._id) } },
        { isOnline: false }
      );
    }

    const updatedIdleUser = await User.findById(idleUser._id);
    const updatedActiveUser = await User.findById(activeUser._id);

    expect(updatedIdleUser.isOnline).toBe(false);
    expect(updatedActiveUser.isOnline).toBe(true);
  });

  it("should handle status updates via findByIdAndUpdate accurately", async () => {
    const userId = activeUser._id;
    const newStatus = false;
    
    const updated = await User.findByIdAndUpdate(userId, { 
      isOnline: newStatus, 
      lastActive: new Date() 
    }, { new: true });

    expect(updated.isOnline).toBe(false);
    expect(updated.lastActive).toBeInstanceOf(Date);
  });
});
