const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true }, // Rich text content
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
    tags: [{ type: String }], // Technology stack, industry, etc.
    category: { type: String, required: true }, // operational, technical, etc.
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isResolved: { type: Boolean, default: false },
    acceptedSolution: { type: mongoose.Schema.Types.ObjectId, ref: "Solution" },
    status: {
      type: String,
      enum: ["open", "closed", "moderated"],
      default: "open",
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

// Add text index for search
problemSchema.index({ title: "text", description: "text", tags: "text" });

// Middleware to filter out deleted problems
problemSchema.pre(/^find/, function(next) {
  if (this.getOptions().withDeleted) {
    return next();
  }
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Problem", problemSchema);
