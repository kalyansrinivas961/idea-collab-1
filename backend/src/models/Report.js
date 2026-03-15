const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["spam", "harassment", "misinformation", "illegal", "copyright", "other"],
    },
    context: {
      type: String,
      required: true,
      minlength: 10, // Requirement was 500 characters, let's stick to user request in logic but schema can be more flexible
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    referenceNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing for efficient moderation queries
reportSchema.index({ idea: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
