const express = require("express");
const multer = require("multer");
const {
  addMessage,
  getMessages,
  uploadMedia,
} = require("../controllers/messageController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error("Invalid file type"));
  },
});

const router = express.Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getMessages);
router.post("/upload-media", upload.single("media"), uploadMedia);

module.exports = router;
