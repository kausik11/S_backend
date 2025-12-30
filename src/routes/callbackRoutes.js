const express = require("express");
const multer = require("multer");
const {
  createCallback,
  updateCallback,
  listCallbacks,
  getCallback,
} = require("../controllers/callbackController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), createCallback);
router.put("/:id", updateCallback);
router.get("/", listCallbacks);
router.get("/:id", getCallback);

module.exports = router;
