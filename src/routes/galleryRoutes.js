const express = require("express");
const multer = require("multer");
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
router.post("/", upload.single("image"), createGalleryItem);
router.put("/:id", upload.single("image"), updateGalleryItem);
router.delete("/:id", deleteGalleryItem);

module.exports = router;
