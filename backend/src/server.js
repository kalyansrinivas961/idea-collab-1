require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { connectDB, closeDB } = require("./config/db");

const app = express();
const server = http.createServer(app);

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://idea-collab-1.vercel.app",
  "https://idea-collab-1-3x75f0zfj-aksrinivas961-4620s-projects.vercel.app",
  process.env.CLIENT_ORIGIN
].filter(Boolean);

// ✅ CORS FIX
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(ao => origin === ao || origin.endsWith(".vercel.app"));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Socket.io
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some(ao => origin === ao || origin.endsWith(".vercel.app"));
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for Socket.io"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Attach io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ideas", require("./routes/ideaRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/collaborations", require("./routes/collaborationRoutes"));
app.use("/api/messages", require("./routes/chatRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// Serve Static Frontend in Production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../frontend", "dist", "index.html"));
  });
}

// Unified Health Check (Always available)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    mode: process.env.NODE_ENV || "development",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require("../package.json").version
  });
});

// Start server
if (require.main === module) {
  connectDB();

  const PORT = process.env.PORT || 10000;

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Shutdown
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});
app.get('/test', (req, res) => {
  res.json({ message: "Backend working correctly 🚀" });
});

module.exports = app;