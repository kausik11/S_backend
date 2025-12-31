const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createCallback,
  updateCallback,
  listCallbacks,
  getCallback,
  deleteCallback,
} = require("../controllers/callbackController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createCallback);
router.put("/:id", authMiddleware, upload.single("image"), updateCallback);
router.get("/", authMiddleware, listCallbacks);
router.get("/:id", authMiddleware, getCallback);
router.delete("/:id", authMiddleware, deleteCallback);

module.exports = router;
