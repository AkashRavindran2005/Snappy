const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  getUserByUsername,
} = require("../controllers/userController");
const User = require("../models/userModel");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.get("/user-by-username", getUserByUsername);

// NEW: save public key for E2EE
router.post("/:id/public-key", async (req, res, next) => {
  try {
    const { publicKey } = req.body;
    const userId = req.params.id;

    if (!publicKey) {
      return res.status(400).json({ msg: "publicKey is required" });
    }

    await User.findByIdAndUpdate(userId, { publicKey });
    return res.json({ msg: "Public key saved" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
