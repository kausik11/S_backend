const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
} = require("../controllers/tipController");

const router = express.Router();

router.get("/", getTips);
router.get("/:id", getTipById);
router.post("/", authMiddleware, createTip);
router.put("/:id", authMiddleware, updateTip);
router.delete("/:id", authMiddleware, deleteTip);

module.exports = router;
