const mongoose = require("mongoose");
const User = require("./src/models/User");
require("dotenv").config();

const checkAdminRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const admin = await User.findOne({ email: "admin@ideacollab.com" });
    if (admin) {
      console.log("Admin found:", admin.email);
      console.log("Admin role:", admin.role);
    } else {
      console.log("No admin found!");
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkAdminRole();
