const express = require("express");
const Groups = require("../models/groupModel");
const Messages = require("../models/messageModel");

const router = express.Router();

// create group
router.post("/create", async (req, res) => {
  const { name, adminId, memberIds } = req.body;
  try {
    const group = await Groups.create({
      name,
      admin: adminId,
      members: memberIds,
    });
    res.json(group);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not create group" });
  }
});

// list groups for a user
router.get("/my/:userId", async (req, res) => {
  try {
    const groups = await Groups.find({
      members: req.params.userId,
    }).select("name avatarImage members");
    res.json(groups);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch groups" });
  }
});

// send group message
router.post("/message", async (req, res) => {
  const { from, groupId, message, mediaUrl, mediaType } = req.body;
  try {
    const msg = await Messages.create({
      from,
      to: groupId,
      message,
      mediaUrl,
      mediaType,
      isGroup: true,
    });
    res.json(msg);
  } catch (e) {
    res.status(500).json({ error: "Could not send message" });
  }
});

// get group messages
router.post("/messages", async (req, res) => {
  const { groupId } = req.body;
  try {
    const msgs = await Messages.find({ to: groupId, isGroup: true });
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

module.exports = router;
