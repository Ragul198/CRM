require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { Server } = require("socket.io");
const http = require("http");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const leadRoutes = require("./routes/leads");
const logRoutes = require("./routes/logs");
const remainderRoutes = require("./routes/reminder");
const reportRoutes = require("./routes/reports");

connectDB();

const app = express();
const server = http.createServer(app);

/* =========================
   CORS CONFIG (FIXED)
========================= */

const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   MIDDLEWARES
========================= */

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/remainders", remainderRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

/* =========================
   SOCKET.IO
========================= */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set("io", io);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.auth;
  if (!userId || !role) return socket.disconnect();

  socket.join(`role:${role}`);
  socket.join(`user:${userId}`);

  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socket.id);

  io.to("role:Admin").to("role:Super Admin").emit("userOnline", {
    userId,
    role,
    socketCount: onlineUsers.get(userId).size,
  });

  socket.on("disconnect", () => {
    const set = onlineUsers.get(userId);
    if (!set) return;
    set.delete(socket.id);
    if (set.size === 0) onlineUsers.delete(userId);
  });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
