const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createUser,
  listUsers,
  updateUser,
  updatePassword,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", authMiddleware, createUser);
router.get("/", authMiddleware, listUsers);
router.put("/:id", authMiddleware, updateUser);
router.put("/:id/password", authMiddleware, updatePassword);

module.exports = router;
