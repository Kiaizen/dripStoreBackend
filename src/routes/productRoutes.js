const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const authenticateToken = require('../middleware/auth');

router.get('/product/search', getProducts);
router.get('/product/:id', getProductById);
router.post('/product', authenticateToken, createProduct);
router.put('/product/:id', authenticateToken, updateProduct);
router.delete('/product/:id', authenticateToken, deleteProduct);

module.exports = router;
