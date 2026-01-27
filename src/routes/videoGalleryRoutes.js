const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getVideoGallery,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoGalleryController");

const router = express.Router();

router.get("/", getVideoGallery);
router.get("/:id", getVideoById);
router.post("/", authMiddleware, createVideo);
router.put("/:id", authMiddleware, updateVideo);
router.delete("/:id", authMiddleware, deleteVideo);

module.exports = router;
