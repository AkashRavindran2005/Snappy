const Messages = require("../models/messageModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: { $all: [from, to] },
    }).sort({ createdAt: 1 });

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
      mediaUrl: msg.message.mediaUrl,
      mediaType: msg.message.mediaType,
      timestamp: msg.createdAt,
    }));

    return res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, mediaUrl, mediaType } = req.body;

    await Messages.create({
      message: { text: message || "", mediaUrl: mediaUrl || null, mediaType: mediaType || null },
      users: [from, to],
      sender: from,
      recipient: to,
    });

    return res.json({ msg: "Message added successfully" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file" });
    }

    const file = req.file;
    const mediaType = file.mimetype.startsWith("video") ? "video" : "image";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const uploadDir = path.join(__dirname, "../uploads", mediaType);

    await fs.mkdir(uploadDir, { recursive: true });

    if (mediaType === "image") {
      await sharp(file.buffer)
        .resize(1280, 720, { fit: "inside" })
        .webp({ quality: 80 })
        .toFile(path.join(uploadDir, `${fileName}.webp`));

      return res.json({
        mediaUrl: `/uploads/image/${fileName}.webp`,
        mediaType,
      });
    } else {
      const ext = path.extname(file.originalname);
      await fs.writeFile(
        path.join(uploadDir, `${fileName}${ext}`),
        file.buffer
      );

      return res.json({
        mediaUrl: `/uploads/video/${fileName}${ext}`,
        mediaType,
      });
    }
  } catch (ex) {
    next(ex);
  }
};
