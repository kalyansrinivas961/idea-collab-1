const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const fs = require("fs");

const User = require("../models/User");
const Idea = require("../models/Idea");
const CollaborationRequest = require("../models/CollaborationRequest");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const PhoneOtp = require("../models/PhoneOtp");

const BACKUP_DIR = path.join(__dirname, "../../backups");
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const backupAndCleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

    console.log("1. Creating secure backup...");
    const backupData = {
      users: await User.find({}),
      ideas: await Idea.find({}),
      collaborationRequests: await CollaborationRequest.find({}),
      conversations: await Conversation.find({}),
      messages: await Message.find({}),
      notifications: await Notification.find({}),
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`Backup saved to ${backupFile}`);

    console.log("2. Systematically removing records...");
    
    // Check if the MongoDB deployment supports transactions (requires replica set)
    const isReplicaSet = mongoose.connection.getClient().topology?.description?.type === 'ReplicaSetNoPrimary' || 
                         mongoose.connection.getClient().topology?.description?.type === 'ReplicaSetWithPrimary' ||
                         mongoose.connection.getClient().topology?.type === 'replica_set';
    
    // Fallback to non-transactional deletion if no replica set (common in local dev)
    if (!isReplicaSet) {
        console.warn("WARNING: This MongoDB instance is not a replica set. Transactions are not supported. Falling back to non-transactional deletion.");
        await User.deleteMany({});
        await Idea.deleteMany({});
        await CollaborationRequest.deleteMany({});
        await Conversation.deleteMany({});
        await Message.deleteMany({});
        await Notification.deleteMany({});
        await PhoneOtp.deleteMany({});
        console.log("Cleanup complete (non-transactional).");
    } else {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          await User.deleteMany({}, { session });
          await Idea.deleteMany({}, { session });
          await CollaborationRequest.deleteMany({}, { session });
          await Conversation.deleteMany({}, { session });
          await Message.deleteMany({}, { session });
          await Notification.deleteMany({}, { session });
          
          await session.commitTransaction();
          console.log("Cleanup complete (transaction-based).");
        } catch (err) {
          await session.abortTransaction();
          throw err;
        } finally {
          session.endSession();
        }
    }

    console.log("Migration and cleanup successful!");
    process.exit();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

backupAndCleanup();
