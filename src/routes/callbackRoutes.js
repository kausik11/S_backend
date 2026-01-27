const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createCallback,
  updateCallback,
  listCallbacks,
  getCallback,
  deleteCallback,
} = require("../controllers/callbackController");

const router = express.Router();

router.post("/", createCallback);
router.put("/:id", authMiddleware, updateCallback);
router.get("/", authMiddleware, listCallbacks);
router.get("/:id", authMiddleware, getCallback);
router.delete("/:id", authMiddleware, deleteCallback);

module.exports = router;
