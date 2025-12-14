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

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/remainders", remainderRoutes);
// Change this line in server.js
app.use("/api/reports", reportRoutes); // Change from "/api/report" to "/api/reports"
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.set("io", io);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.auth;

  // Join role-based and personal rooms
  socket.join(`role:${role}`);
  socket.join(`user:${userId}`);

  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socket.id);

  console.log("onlineUsers Map:", onlineUsers);

  // Emit this user's online status to admins/super-admins
  io.to("role:Admin")
    .to("role:Super Admin")
    .emit("userOnline", {
      userId,
      role,
      socketCount: onlineUsers.get(userId).size,
    });

  // ✅ Send the full online users list to the newly connected client
  const allOnlineUsers = [];
  onlineUsers.forEach((sockets, uId) => {
    allOnlineUsers.push({
      userId: uId,
      socketCount: sockets.size,
      // You can include role here if needed
    });
  });
  socket.emit("userOnline", allOnlineUsers);

  console.log(`🔌 User connected: ${userId}, Role: ${role}, SocketID: ${socket.id}`);
  console.log("   Joined rooms:", socket.rooms);

  // Disconnect handler
  socket.on("disconnect", () => {
    if (!onlineUsers.has(userId)) return;

    const userSockets = onlineUsers.get(userId);
    userSockets.delete(socket.id);

    const count = userSockets.size;
    if (count === 0) onlineUsers.delete(userId);

    io.to("role:Admin")
      .to("role:Super Admin")
      .emit("userOnline", {
        userId,
        role,
        socketCount: count,
      });

    console.log(`❌ User disconnected: ${userId}, Role: ${role}, SocketID: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
