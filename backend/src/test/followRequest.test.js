const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const FollowRequest = require("../models/FollowRequest");
const jwt = require("jsonwebtoken");

describe("Private Follow Request Workflow", () => {
  let userA;
  let userB;
  let tokenA;
  let tokenB;

  beforeEach(async () => {
    userA = await User.create({
      name: "User A",
      email: "usera@test.com",
      password: "password123",
      following: []
    });
    tokenA = jwt.sign({ id: userA._id }, process.env.JWT_SECRET || "mysecretkey123");

    userB = await User.create({
      name: "User B",
      email: "userb@test.com",
      password: "password123",
      followers: []
    });
    tokenB = jwt.sign({ id: userB._id }, process.env.JWT_SECRET || "mysecretkey123");
  });

  it("should create a pending follow request when userA follows userB", async () => {
    const res = await request(app)
      .put(`/api/users/${userB._id}/follow`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("requested");

    const followReq = await FollowRequest.findOne({ sender: userA._id, receiver: userB._id });
    expect(followReq).toBeDefined();
    expect(followReq.status).toBe("pending");

    // Check that follow hasn't happened yet
    const updatedUserA = await User.findById(userA._id);
    expect(updatedUserA.following.length).toBe(0);
  });

  it("should allow cancelling a pending follow request", async () => {
    await FollowRequest.create({ sender: userA._id, receiver: userB._id, status: "pending" });

    const res = await request(app)
      .put(`/api/users/${userB._id}/follow`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("request_cancelled");

    const followReq = await FollowRequest.findOne({ sender: userA._id, receiver: userB._id });
    expect(followReq).toBeNull();
  });

  it("should establish follow relationship only after approval", async () => {
    const followReq = await FollowRequest.create({ sender: userA._id, receiver: userB._id, status: "pending" });

    // User B accepts
    const res = await request(app)
      .put(`/api/users/follow-requests/${followReq._id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ status: "accepted" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("accepted");

    const updatedUserA = await User.findById(userA._id);
    const updatedUserB = await User.findById(userB._id);

    expect(updatedUserA.following).toContainEqual(userB._id);
    expect(updatedUserB.followers).toContainEqual(userA._id);
  });

  it("should not allow user A to accept their own follow request", async () => {
    const followReq = await FollowRequest.create({ sender: userA._id, receiver: userB._id, status: "pending" });

    const res = await request(app)
      .put(`/api/users/follow-requests/${followReq._id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ status: "accepted" });

    expect(res.status).toBe(401);
  });

  it("should allow rejecting a follow request", async () => {
    const followReq = await FollowRequest.create({ sender: userA._id, receiver: userB._id, status: "pending" });

    const res = await request(app)
      .put(`/api/users/follow-requests/${followReq._id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ status: "rejected" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("rejected");

    const updatedUserA = await User.findById(userA._id);
    expect(updatedUserA.following.length).toBe(0);
  });
});
