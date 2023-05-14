const asyncHandler = require("express-async-handler");
const Conversation = require("../Models/ConversationsModel");
const Message = require("../Models/MessagesModels");
const User = require("../Models/UsersModel");
module.exports = {
  AddNewConverstions: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { receiverId } = req.params;
    if (userId === receiverId) {
      return res.status(400).json("users not provided");
    }
    const sender = await User.findById(userId);
    if (!sender) {
      return res.status(400).json("sender not found");
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(400).json("receiver not found");
    }
    const conversation = await Conversation.findOne({
      members: { $all: [userId, receiverId] },
    });
    if (conversation) {
      return res.status(200).json(conversation);
    }
    const newConversation = await Conversation.create({
      members: [userId, receiverId],
    });
    return res.status(200).json(newConversation);
  }),
  getUserConversations: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    // get user conversations with messages more than 0 then sorted by updated at
    const conversations = await Conversation.find({
      members: { $in: [userId] },
      messages: { $gt: 0 },
    }).sort({ updatedAt: -1 });
    // send conversations data with receiver id and updated at in response
    const AllConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const receiver = await User.findById(receiverId);
        const last_message_in_conversation = await Message.findOne({
          conversationId: conversation._id,
        }).sort({ updatedAt: -1 });
        const unseen_messages_for_user = await Message.find({
          conversationId: conversation._id,
          sender: { $ne: userId },
          seenBy: { $nin: [userId] },
        });

        return {
          receiverId,
          receiverName: receiver.username,
          receiverAvatar: receiver.avatar.url,
          id: conversation._id,
          last_message: last_message_in_conversation.text,
          unseen_messages: unseen_messages_for_user.length,
          updatedAt: conversation.updatedAt,
        };
      })
    );
    return res.status(200).json(AllConversations);
  }),
};
