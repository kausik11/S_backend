const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", authMiddleware, upload.single("image"), createService);
router.put("/:id", authMiddleware, upload.single("image"), updateService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;
