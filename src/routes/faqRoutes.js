const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
  searchFaqs,
  getFaqsByTag,
} = require("../controllers/faqController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getFaqs);
router.get("/search", searchFaqs);
router.get("/tags/:tag", getFaqsByTag);
router.get("/:id", getFaqById);
router.post("/", authMiddleware, upload.single("image"), createFaq);
router.put("/:id", authMiddleware, upload.single("image"), updateFaq);
router.delete("/:id", authMiddleware, deleteFaq);

module.exports = router;
