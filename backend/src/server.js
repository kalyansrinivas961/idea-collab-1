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

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
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
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
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

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/messages", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);

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
