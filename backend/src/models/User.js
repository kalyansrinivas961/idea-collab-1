const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Optional for Google users
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, default: "Developer" }, // Developer, Designer, etc.
    avatarUrl: { type: String, default: "" },
    headline: { type: String, default: "" }, // Professional headline
    skills: [{ type: String }],
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    savedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Idea" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Handle Google-only accounts
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
