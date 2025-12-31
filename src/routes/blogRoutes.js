const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getBlogsByCategory,
  addComment,
  debounceSearch,
} = require("../controllers/blogController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getBlogs);
router.get("/search", debounceSearch, searchBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/:id", getBlogById);
router.post("/", authMiddleware, upload.single("image"), createBlog);
router.put("/:id", authMiddleware, upload.single("image"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.post("/:id/comments", addComment);

module.exports = router;
