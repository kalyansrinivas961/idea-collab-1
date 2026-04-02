const mongoose = require("mongoose");
const User = require("./src/models/User");
require("dotenv").config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      console.log("Admin found:", admin.email);
    } else {
      console.log("No admin found!");
      
      // Create a default admin if none exists
      /*
      const newAdmin = await User.create({
        name: "Admin",
        email: "admin@test.com",
        password: "password123",
        role: "admin"
      });
      console.log("Created admin:", newAdmin.email);
      */
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkAdmin();
