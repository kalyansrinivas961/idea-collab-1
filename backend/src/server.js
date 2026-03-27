require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { connectDB, closeDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const userRoutes = require("./routes/userRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reportRoutes = require("./routes/reportRoutes");
const qaRoutes = require("./routes/qaRoutes");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const io = new Server(server, {
  cors: corsOptions,
});

// Track online users: socketId -> userId
const onlineUsers = new Map();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  
  // Join user room for private notifications
  socket.on("join", async (userId) => {
    if (userId) {
      socket.join(userId);
      onlineUsers.set(socket.id, userId);
      
      try {
        const User = require("./models/User");
        await User.findByIdAndUpdate(userId, { 
          isOnline: true, 
          lastActive: new Date() 
        });
        io.emit("user_activity", { userId, status: "active" });
      } catch (err) {
        console.error("Error updating activity on join:", err);
      }
      
      console.log(`User ${userId} joined room`);
    }
  });

  // Join group room
  socket.on("join:group", (groupId) => {
    if (groupId) {
      socket.join(`group:${groupId}`);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    }
  });

  // Typing indicators
  socket.on("typing", ({ receiverId, senderId }) => {
    socket.to(receiverId).emit("typing", { senderId });
  });

  socket.on("stop_typing", ({ receiverId, senderId }) => {
    socket.to(receiverId).emit("stop_typing", { senderId });
  });

  // Real-time activity status
  socket.on("update_activity_status", async ({ userId, status }) => {
    try {
      if (!userId) return;
      const User = require("./models/User");
      const isOnline = status === "active";
      const presenceStatus = isOnline ? "online" : "offline";
      
      const updatedUser = await User.findByIdAndUpdate(userId, { 
        isOnline, 
        presenceStatus,
        lastActive: new Date() 
      }, { new: true });

      if (updatedUser) {
        // Broadcast to everyone to update their local state
        io.emit("user_activity", { userId, status: presenceStatus });
        console.log(`[Status Change] User ${userId} (${updatedUser.name}) updated to: ${presenceStatus} at ${new Date().toISOString()}`);
      }
    } catch (err) {
      console.error("[Status Change Error]:", err);
    }
  });

  socket.on("disconnect", async () => {
    console.log("[Socket Connection] Socket disconnected:", socket.id);
    const userId = onlineUsers.get(socket.id);
    
    if (userId) {
      onlineUsers.delete(socket.id);
      
      // Check if user has other open sockets
      const remainingSockets = Array.from(onlineUsers.values()).filter(id => id === userId);
      
      if (remainingSockets.length === 0) {
        try {
          const User = require("./models/User");
          const updatedUser = await User.findByIdAndUpdate(userId, { 
            isOnline: false, 
            presenceStatus: "offline",
            lastActive: new Date() 
          }, { new: true });
          
          if (updatedUser) {
            io.emit("user_activity", { userId, status: "offline" });
            console.log(`[Status Change] User ${userId} (${updatedUser.name}) marked as offline due to disconnection at ${new Date().toISOString()}.`);
          }
        } catch (err) {
          console.error("[Status Change Error on Disconnect]:", err);
        }
      }
    }
  });
});

// Periodic cleanup: mark users as away or offline after inactivity
// Threshold: 15 minutes for "away", 30 minutes for "offline" (or as requested)
// The user specifically asked for "away" or "offline" after 15 min.
// Let's implement: 15 min -> away, 30 min -> offline
setInterval(async () => {
  try {
    const User = require("./models/User");
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // 1. Mark users as "away" if idle for > 15 mins but < 30 mins
    const awayUsers = await User.find({ 
      presenceStatus: "online", 
      lastActive: { $lt: fifteenMinutesAgo, $gt: thirtyMinutesAgo } 
    });
    
    if (awayUsers.length > 0) {
      const userIds = awayUsers.map(u => u._id);
      await User.updateMany({ _id: { $in: userIds } }, { presenceStatus: "away" });
      userIds.forEach(id => io.emit("user_activity", { userId: id.toString(), status: "away" }));
      console.log(`Presence Cleanup: ${awayUsers.length} users marked as AWAY`);
    }

    // 2. Mark users as "offline" if idle for > 30 mins
    const idleUsers = await User.find({ 
      isOnline: true, 
      lastActive: { $lt: thirtyMinutesAgo } 
    });
    
    if (idleUsers.length > 0) {
      const userIds = idleUsers.map(u => u._id);
      await User.updateMany({ _id: { $in: userIds } }, { isOnline: false, presenceStatus: "offline" });
      userIds.forEach(id => io.emit("user_activity", { userId: id.toString(), status: "offline" }));
      console.log(`Presence Cleanup: ${idleUsers.length} idle users marked as OFFLINE`);
    }
  } catch (err) {
    console.error("Error in idle user cleanup task:", err);
  }
}, 1 * 60 * 1000); // Run every minute for better precision

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/messages", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/qa", qaRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({
    status: "Healthy",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || "development",
  });
});

// MongoDB Connection
if (require.main === module) {
  connectDB();

  const PORT = process.env.PORT || 5002;
  // Listen on 0.0.0.0 for LAN access
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Graceful shutdown logic
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});

module.exports = app;
