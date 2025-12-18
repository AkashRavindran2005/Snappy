// server/routes/friends.js
const express = require("express");
const Users = require("../models/userModel");

const router = express.Router();

// Send friend request
router.post("/request", async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "from and to are required" });
    }
    if (from === to) {
      return res.status(400).json({ error: "Cannot add yourself" });
    }

    const [fromUser, toUser] = await Promise.all([
      Users.findById(from),
      Users.findById(to),
    ]);

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Already friends
    if (
      fromUser.friends.includes(toUser._id) ||
      toUser.friends.includes(fromUser._id)
    ) {
      return res.status(400).json({ error: "Already friends" });
    }

    // Existing pending request either way
    if (
      fromUser.outgoingRequests.includes(toUser._id) ||
      fromUser.incomingRequests.includes(toUser._id) ||
      toUser.outgoingRequests.includes(fromUser._id) ||
      toUser.incomingRequests.includes(fromUser._id)
    ) {
      return res.status(400).json({ error: "Request already pending" });
    }

    fromUser.outgoingRequests.push(toUser._id);
    toUser.incomingRequests.push(fromUser._id);

    await Promise.all([fromUser.save(), toUser.save()]);

    return res.json({ msg: "Friend request sent" });
  } catch (err) {
    console.error("Friend request error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Accept friend request
router.post("/accept", async (req, res) => {
  try {
    const { userId, from } = req.body; // userId = accepting user, from = requester

    const [user, fromUser] = await Promise.all([
      Users.findById(userId),
      Users.findById(from),
    ]);

    if (!user || !fromUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure there is a pending request
    if (!user.incomingRequests.includes(fromUser._id)) {
      return res.status(400).json({ error: "No such request" });
    }

    // Remove from pending lists
    user.incomingRequests = user.incomingRequests.filter(
      (id) => id.toString() !== fromUser._id.toString()
    );
    fromUser.outgoingRequests = fromUser.outgoingRequests.filter(
      (id) => id.toString() !== user._id.toString()
    );

    // Add to friends
    if (!user.friends.includes(fromUser._id)) {
      user.friends.push(fromUser._id);
    }
    if (!fromUser.friends.includes(user._id)) {
      fromUser.friends.push(user._id);
    }

    await Promise.all([user.save(), fromUser.save()]);

    return res.json({ msg: "Friend request accepted" });
  } catch (err) {
    console.error("Accept friend error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Decline / cancel friend request
router.post("/decline", async (req, res) => {
  try {
    const { userId, otherId } = req.body;

    const [user, other] = await Promise.all([
      Users.findById(userId),
      Users.findById(otherId),
    ]);

    if (!user || !other) {
      return res.status(404).json({ error: "User not found" });
    }

    user.incomingRequests = user.incomingRequests.filter(
      (id) => id.toString() !== other._id.toString()
    );
    user.outgoingRequests = user.outgoingRequests.filter(
      (id) => id.toString() !== other._id.toString()
    );
    other.incomingRequests = other.incomingRequests.filter(
      (id) => id.toString() !== user._id.toString()
    );
    other.outgoingRequests = other.outgoingRequests.filter(
      (id) => id.toString() !== user._id.toString()
    );

    await Promise.all([user.save(), other.save()]);

    return res.json({ msg: "Request removed" });
  } catch (err) {
    console.error("Decline friend error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get friends list
router.get("/list/:userId", async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId).populate(
      "friends",
      "username email avatarImage isAvatarImageSet"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user.friends);
  } catch (err) {
    console.error("Get friends error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get pending requests (incoming + outgoing)
router.get("/requests/:userId", async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId)
      .populate("incomingRequests", "username email avatarImage")
      .populate("outgoingRequests", "username email avatarImage");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      incoming: user.incomingRequests,
      outgoing: user.outgoingRequests,
    });
  } catch (err) {
    console.error("Get requests error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
