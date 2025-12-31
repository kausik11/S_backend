const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getGalleryItems,
  getGalleryItemsByTag,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getGalleryItems);
router.get("/tags/:tag", getGalleryItemsByTag);
router.get("/:id", getGalleryItemById);
router.post("/", authMiddleware, upload.single("image"), createGalleryItem);
router.put("/:id", authMiddleware, upload.single("image"), updateGalleryItem);
router.delete("/:id", authMiddleware, deleteGalleryItem);

module.exports = router;
