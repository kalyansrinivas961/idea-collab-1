require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/idea-collab";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    const adminEmail = "admin@ideacollab.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Existing user promoted to admin:", adminEmail);
    } else {
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: "Admin@123",
        role: "admin",
        headline: "Platform Moderator",
        skills: ["Management", "Security", "Moderation"],
        status: "Active"
      });
      console.log("New admin user created:", adminEmail);
    }

    console.log("Admin credentials:");
    console.log("Email: " + adminEmail);
    console.log("Password: Admin@123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
