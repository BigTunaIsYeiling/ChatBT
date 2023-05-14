const { Schema, model } = require("mongoose");
const MessagesSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
      ref: "Conversation",
    },
    sender: {
      type: String,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
    seenBy: {
      type: Array,
      default: [],
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Messages",
  }
);
module.exports = model("Message", MessagesSchema);
