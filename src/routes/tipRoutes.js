const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
} = require("../controllers/tipController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getTips);
router.get("/:id", getTipById);
router.post("/", authMiddleware, upload.single("image"), createTip);
router.put("/:id", authMiddleware, upload.single("image"), updateTip);
router.delete("/:id", authMiddleware, deleteTip);

module.exports = router;
