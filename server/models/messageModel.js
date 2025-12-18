const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    message: {
      text: { type: String, default: "" },
      mediaUrl: { type: String, default: null },
      mediaType: {
        type: String,
        enum: ["image", "video", null],
        default: null,
      },
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Groups",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", MessageSchema);
