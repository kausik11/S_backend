const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createSubscription,
  listSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} = require("../controllers/newsletterController");

const router = express.Router();

router.post("/", createSubscription);
router.get("/", authMiddleware, listSubscriptions);
router.get("/:id", authMiddleware, getSubscription);
router.put("/:id", authMiddleware, updateSubscription);
router.delete("/:id", authMiddleware, deleteSubscription);

module.exports = router;
