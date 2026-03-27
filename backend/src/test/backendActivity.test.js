const mongoose = require("mongoose");
const User = require("../models/User");

describe("User Activity Tracking Logic", () => {
  let idleUser, activeUser;

  beforeEach(async () => {
    await User.deleteMany({});

    const thirtyOneMinutesAgo = new Date(Date.now() - 31 * 60 * 1000);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Create an idle user (online but last active > 30m ago)
    idleUser = await User.create({
      name: "Idle User",
      email: "idle@test.com",
      isOnline: true,
      lastActive: thirtyOneMinutesAgo
    });

    // Create an active user (online and last active < 30m ago)
    activeUser = await User.create({
      name: "Active User",
      email: "active@test.com",
      isOnline: true,
      lastActive: fiveMinutesAgo
    });
  });

  it("should identify users who have been idle for more than 30 minutes", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const idleUsers = await User.find({ 
      isOnline: true, 
      lastActive: { $lt: thirtyMinutesAgo } 
    });

    expect(idleUsers.length).toBe(1);
    expect(idleUsers[0]._id.toString()).toBe(idleUser._id.toString());
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
