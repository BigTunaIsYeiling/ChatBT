const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      url: {
        default:
          "https://res.cloudinary.com/drsodrtuf/image/upload/v1682802806/WhatsApp_Image_2023-04-30_at_00.12.21_wxryih.jpg",
        type: String,
      },
      avatarid: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
module.exports = model("User", userSchema);
