const Crouter = require("express").Router();
const verifyAccess = require("../Middlewares/Authorization");
const {
  AddNewConverstions,
  getUserConversations,
} = require("../Controllers/ConversationsControllers");
Crouter.route("/:receiverId").post(verifyAccess, AddNewConverstions);
Crouter.route("/").get(verifyAccess, getUserConversations);
module.exports = Crouter;
