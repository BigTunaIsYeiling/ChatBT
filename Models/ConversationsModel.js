const { Schema, model } = require("mongoose");
const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
      required: true,
    },
    messages: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "Conversations",
  }
);
module.exports = model("Conversation", ConversationSchema);
