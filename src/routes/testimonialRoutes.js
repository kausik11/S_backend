const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getTestimonials);
router.get("/:id", getTestimonialById);
router.post("/", authMiddleware, upload.single("image"), createTestimonial);
router.put("/:id", authMiddleware, upload.single("image"), updateTestimonial);
router.delete("/:id", authMiddleware, deleteTestimonial);

module.exports = router;
