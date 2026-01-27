const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getCertificates);
router.get("/:id", getCertificateById);
router.post("/", authMiddleware, upload.single("image"), createCertificate);
router.put("/:id", authMiddleware, upload.single("image"), updateCertificate);
router.delete("/:id", authMiddleware, deleteCertificate);

module.exports = router;
