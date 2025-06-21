const Category = require('../models/Category');

const getCategories = async (query) => {
  const { limit = 12, page = 1, fields, use_in_menu } = query;
  const where = {};
  if (use_in_menu) where.use_in_menu = use_in_menu;
  const offset = limit == -1 ? undefined : (page - 1) * limit;

  const result = await Category.findAndCountAll({ where, limit: limit == -1 ? undefined : +limit, offset });
  return {
    data: result.rows,
    total: result.count,
    limit: +limit,
    page: +page
  };
};

const getCategoryById = async (id) => await Category.findByPk(id);
const createCategory = async (data) => await Category.create(data);
const updateCategory = async (id, data) => {
  const cat = await Category.findByPk(id);
  if (!cat) return null;
  await cat.update(data);
  return cat;
};
const deleteCategory = async (id) => {
  const cat = await Category.findByPk(id);
  if (!cat) return false;
  await cat.destroy();
  return true;
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};