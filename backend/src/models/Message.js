const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for group chats
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
    content: {
      type: String,
      default: "",
    },
    attachment: {
      url: String,
      fileType: String, // 'image', 'document', etc.
      originalName: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    deletedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
