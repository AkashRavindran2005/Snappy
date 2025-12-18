const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    avatarImage: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Groups", groupSchema);
