const categoryService = require('../services/categoryService');

const getCategories = async (req, res) => {
  try {
    const result = await categoryService.search(req.query);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (!category) return res.status(404).send();
    return res.status(200).json(category);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    await categoryService.create(req.body);
    return res.status(201).send();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updated = await categoryService.update(req.params.id, req.body);
    if (!updated) return res.status(404).send();
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await categoryService.remove(req.params.id);
    if (!deleted) return res.status(404).send();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
