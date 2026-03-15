const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    visibility: {
      type: String,
      enum: ["public", "connections", "private"],
      default: "public",
    },
    allowedCommenters: {
      type: String,
      enum: ["anyone", "connections", "none"],
      default: "anyone",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attachments: [
      {
        url: String,
        fileType: String,
        originalName: String,
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);
