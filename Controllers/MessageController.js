const asyncHandler = require("express-async-handler");
const Message = require("../Models/MessagesModels");
const Conversation = require("../Models/ConversationsModel");
const User = require("../Models/UsersModel");
module.exports = {
  AddNewMessage: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { conversationId } = req.params;
    const { text } = req.body;
    // check if user is in conversation
    const conversationExist = await Conversation.findById(conversationId);
    if (!conversationExist.members.includes(userId)) {
      return res.status(400).json("you are not in this conversation");
    }
    // add 1 to conversation messages count
    const conversation = await Conversation.findById(conversationId);
    conversation.messages += 1;
    conversation.save();
    const message = await Message.create({
      conversationId,
      sender: userId,
      text,
      seenBy: [userId],
    });
    return res.status(200).json(message);
  }),
  getconversationMessages: asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId });
    return res.status(200).json(messages);
  }),
  seenMessages: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { conversationId } = req.params;
    // get messages of conversation
    const messages = await Message.find({ conversationId });
    // push userId to seenBy array unless if he saw them
    messages.forEach((message) => {
      if (!message.seenBy.includes(userId)) {
        message.seenBy.push(userId);
      }
      message.save();
    });
    return res.status(200).json(messages);
  }),
  getAllMessages: asyncHandler(async (req, res) => {
    // sort messages by date
    const messages = await Message.find().sort({ createdAt: 1 });
    return res.status(200).json(messages);
  }),
};
