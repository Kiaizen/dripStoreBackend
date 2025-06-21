const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const result = await productService.search(req.query);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) return res.status(404).send();
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    await productService.create(req.body);
    return res.status(201).send();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await productService.update(req.params.id, req.body);
    if (!updated) return res.status(404).send();
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await productService.remove(req.params.id);
    if (!deleted) return res.status(404).send();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
