const mongoose = require("mongoose");
const crypto = require("crypto");

const sharedLinkSchema = new mongoose.Schema(
  {
    idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For internal sharing
    shareToken: { type: String, unique: true, required: true },
    permissions: {
      type: String,
      enum: ["view", "comment", "edit"],
      default: "view",
    },
    expiresAt: { type: Date },
    accessCount: { type: Number, default: 0 },
    lastAccessedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    accessLog: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If authenticated
        ip: String,
        userAgent: String,
        accessedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to generate a unique share token if not provided
sharedLinkSchema.pre("validate", function (next) {
  if (!this.shareToken) {
    this.shareToken = crypto.randomBytes(16).toString("hex");
  }
  next();
});

module.exports = mongoose.model("SharedLink", sharedLinkSchema);
