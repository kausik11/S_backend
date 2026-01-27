const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getChambers,
  getChamberById,
  createChamber,
  updateChamber,
  deleteChamber,
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} = require("../controllers/chamberController");

const router = express.Router();

router.get("/", getChambers);
router.get("/availability", getAvailability);
router.post("/availability", authMiddleware, createAvailability);
router.put("/availability/:id", authMiddleware, updateAvailability);
router.delete("/availability/:id", authMiddleware, deleteAvailability);
router.get("/:id", getChamberById);
router.post("/", authMiddleware, createChamber);
router.put("/:id", authMiddleware, updateChamber);
router.delete("/:id", authMiddleware, deleteChamber);

module.exports = router;
