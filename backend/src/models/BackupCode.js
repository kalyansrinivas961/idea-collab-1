const mongoose = require("mongoose");

const backupCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hashedCode: {
      type: String,
      required: true,
    },
    usedStatus: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexing for faster lookups per user
backupCodeSchema.index({ user: 1, usedStatus: 1 });

module.exports = mongoose.model("BackupCode", backupCodeSchema);
