const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getChambers,
  getChamberById,
  createChamber,
  updateChamber,
  deleteChamber,
} = require("../controllers/chamberController");

const router = express.Router();

router.get("/", getChambers);
router.get("/:id", getChamberById);
router.post("/", authMiddleware, createChamber);
router.put("/:id", authMiddleware, updateChamber);
router.delete("/:id", authMiddleware, deleteChamber);

module.exports = router;
