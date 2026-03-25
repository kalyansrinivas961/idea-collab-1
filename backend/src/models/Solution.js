const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    content: { type: String, required: true }, // Rich text content
    codeSnippets: [
      {
        language: { type: String, default: "javascript" },
        code: { type: String },
      },
    ],
    attachments: [
      {
        url: { type: String },
        fileType: { type: String },
        originalName: { type: String },
      },
    ],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAccepted: { type: Boolean, default: false },
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: "Solution" }, // For threaded replies
  },
  { timestamps: true }
);

module.exports = mongoose.model("Solution", solutionSchema);
