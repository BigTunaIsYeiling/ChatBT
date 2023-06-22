const asyncHandler = require("express-async-handler");
const { hash, compare } = require("bcryptjs");
const User = require("../Models/UsersModel");
const Conversation = require("../Models/ConversationsModel");
const Message = require("../Models/MessagesModels");
const { sign, verify } = require("jsonwebtoken");
const cloudinary = require("../Middlewares/CloudinaryConfig");
module.exports = {
  getallUsers: asyncHandler(async (req, res) => {
    // get all users except the admin
    const { userId } = req.user;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    return res.json(users);
  }),
  Login: asyncHandler(async (req, res) => {
    const user = req.user;
    //Create and assign a token
    const token = sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15s",
    });
    res.cookie("Access-token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + +1000 * 15),
      sameSite: "none",
      secure: process.env.NODE_ENV,
    });
    return res.json({ msg: " user Logged in successfully " });
  }),
  Register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //Hash the password
    const hashedPassword = await hash(password, 12);
    //Create a new user
    const NewUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //Create and assign a token
    const token = sign({ userId: NewUser._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15s",
    });
    res.cookie("Access-token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + +1000 * 15),
      sameSite: "none",
      secure: process.env.NODE_ENV,
    });
    return res.json({ msg: "User Created" });
  }),
  GetAccess: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    return res.json({
      username: user.username,
      avatar: user.avatar.url,
      id: user._id,
      email: user.email,
    });
  }),
  AccessRefresh: asyncHandler(async (req, res, next) => {
    const cookie = req.cookies["Access-token"];
    if (!cookie) {
      return res.status(401).json({ msg: "No Cookies" });
    }
    const user = verify(cookie, process.env.ACCESS_TOKEN);
    const { userId } = user;
    const newToken = sign({ userId }, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
    });
    res.cookie("Access-token", newToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 15),
      sameSite: "none",
      secure: process.env.NODE_ENV,
    });
    req.user = user;
    next();
  }),
  LogOut: asyncHandler(async (req, res) => {
    res.cookie("Access-token", "", {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 15),
      sameSite: "none",
      secure: process.env.NODE_ENV,
    });
    // Redirect the user to the home page.
    return res.redirect("/");
  }),
  UpdateUser: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    let errors = [];
    const user = await User.findById(userId);
    const { newPassword, newUsername } = req.body;
    if (newPassword) {
      if (newPassword.trim().length <= 8) {
        errors.push("Password must be at least 8 characters long");
        return res.status(400).json({ errors });
      }
      const oldPass = await compare(newPassword, user.password);
      if (oldPass) {
        errors.push("Thats already your password");
        return res.status(400).json({ errors });
      }
    }
    if (newUsername) {
      if (newUsername.trim().length <= 3) {
        errors.push("Username must be at least 3 characters long");
        return res.status(400).json({ errors });
      }
      if (newUsername === user.username) {
        errors.push("Thats already your username");
        return res.status(400).json({ errors });
      }
    }
    const oldpic = req.file && user.avatar.avatarid;
    if (oldpic) {
      await cloudinary.uploader.destroy(oldpic);
    }
    const result =
      req.file &&
      (await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      }));
    user.password = newPassword ? await hash(newPassword, 12) : user.password;
    user.username = newUsername ? newUsername : user.username;
    user.avatar.url = req.file ? result.secure_url : user.avatar.url;
    user.avatar.avatarid = req.file ? result.public_id : user.avatar.avatarid;
    await user.save();
    return res.json({ msg: "User Updated" });
  }),
  DeleteUser: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);
    const oldpic = user.avatar.avatarid;
    if (oldpic) {
      await cloudinary.uploader.destroy(oldpic);
    }
    // delete all conversations he in and this conversations messages
    const userConversations = await Conversation.find({
      members: { $in: [userId] },
    });
    userConversations.forEach(async (conversation) => {
      await Message.deleteMany({ conversationId: conversation._id });
      await conversation.deleteOne();
    });
    await user.deleteOne();
    res.clearCookie("Access-token");
    return res.json({ msg: "User Deleted" });
  }),
};
