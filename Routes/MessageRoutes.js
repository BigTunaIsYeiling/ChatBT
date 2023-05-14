const Mrouter = require("express").Router();
const verifyAccess = require("../Middlewares/Authorization");
const {
  AddNewMessage,
  getconversationMessages,
  seenMessages,
  getAllMessages,
} = require("../Controllers/MessageController");
Mrouter.route("/:conversationId").post(verifyAccess, AddNewMessage);
Mrouter.route("/:conversationId").get(verifyAccess, getconversationMessages);
Mrouter.route("/seen/:conversationId").put(verifyAccess, seenMessages);
Mrouter.route("/").get(verifyAccess, getAllMessages);
module.exports = Mrouter;
