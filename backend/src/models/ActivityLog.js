const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "follow", 
        "unfollow", 
        "remove_follower", 
        "request_follow", 
        "accept_follow", 
        "reject_follow", 
        "create_idea", 
        "update_profile", 
        "like_idea", 
        "comment_idea", 
        "create_problem", 
        "delete_problem", 
        "create_solution", 
        "delete_solution", 
        "vote_problem", 
        "vote_solution",
        "generate_backup_codes",
        "regenerate_backup_codes",
        "use_backup_code",
        "reset_password"
      ],
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ user: 1, action: 1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
