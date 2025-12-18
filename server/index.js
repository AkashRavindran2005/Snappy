const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const socketIO = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const friendRoutes = require("./routes/friends");
const groupRoutes = require("./routes/groups"); // NEW

const app = express();

// CORS for Vercel frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://snappy-rosy-omega.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images & videos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log("DB error:", err.message));

// Healthcheck
app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/groups", groupRoutes); // NEW

// Global error handler (optional but recommended)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

// Socket.io
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "https://snappy-rosy-omega.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // direct messages
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", {
        msg: data.msg || "",
        mediaUrl: data.mediaUrl || null,
        mediaType: data.mediaType || null,
      });
    }
  });

  // NEW: group messages – broadcast to all member userIds in data.members
  socket.on("send-group-msg", (data) => {
    const { groupId, members, msg, mediaUrl, mediaType, from } = data;
    if (!Array.isArray(members)) return;

    members.forEach((userId) => {
      const userSocket = onlineUsers.get(userId);
      if (userSocket) {
        io.to(userSocket).emit("group-msg-receive", {
          groupId,
          from,
          msg: msg || "",
          mediaUrl: mediaUrl || null,
          mediaType: mediaType || null,
        });
      }
    });
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});
