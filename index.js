const express = require("express");
require("dotenv").config({ path: "./config.env" });
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const Urouter = require("./Routes/UserRoutes");
const Crouter = require("./Routes/ConversationRoutes");
const Mrouter = require("./Routes/MessageRoutes");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use("/users", Urouter);
app.use("/conversations", Crouter);
app.use("/messages", Mrouter);
let Activeuser = [];

const addUser = (userId, socketId) => {
  !Activeuser.some((user) => user.userId === userId) &&
    Activeuser.push({ userId, socketId });
};
const removeUser = (socketId) => {
  Activeuser = Activeuser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return Activeuser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", Activeuser);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", Activeuser);
  });
  socket.on("send-message", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message");
    }
  });
  socket.on("typing", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("typing");
    }
  });
  socket.on("stopTyping", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("stopTyping");
    }
  });
  // user logged out
  socket.on("logout", (receiverId) => {
    const user = getUser(receiverId);
    removeUser(user.socketId);
    io.emit("getUsers", Activeuser);
  });

  // user logged in
  socket.on("login", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      // add this user to active users
      return null;
    }
    addUser(user.userId, socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
