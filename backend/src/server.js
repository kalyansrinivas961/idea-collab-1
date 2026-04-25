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
const shareRoutes = require("./routes/shareRoutes");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => origin === allowed) || 
                     origin.endsWith(".vercel.app") || 
                     origin.includes("localhost") || 
                     origin.includes("127.0.0.1") ||
                     origin.includes("ngrok-free.dev") || // Allow ngrok
                     /^http:\/\/192\.168\.\d+\.\d+:5173$/.test(origin); // Allow LAN access

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
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
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
      onlineUsers.set(socket.id, userId);
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

  socket.on("disconnect", async () => {
    console.log("[Socket Connection] Socket disconnected:", socket.id);
    const userId = onlineUsers.get(socket.id);
    if (userId) {
      onlineUsers.delete(socket.id);
    }
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
app.use("/api/qa", qaRoutes);
app.use("/api/share", shareRoutes);

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
