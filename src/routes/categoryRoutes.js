const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authenticateToken = require("../middleware/auth");

router.get("/category/search", getCategories);
router.get("/category/:id", getCategoryById);
router.post("/category", authenticateToken, createCategory);
router.put("/category/:id", authenticateToken, updateCategory);
router.delete("/category/:id", authenticateToken, deleteCategory);

module.exports = router;
