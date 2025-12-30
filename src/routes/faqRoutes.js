const express = require("express");
const multer = require("multer");
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
router.post("/", upload.single("image"), createFaq);
router.put("/:id", upload.single("image"), updateFaq);
router.delete("/:id", deleteFaq);

module.exports = router;
