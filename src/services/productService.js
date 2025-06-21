const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const ProductOption = require('../models/ProductOption');
const Category = require('../models/Category');
const { Op } = require('sequelize');

const getProducts = async (query) => {
  const { limit = 12, page = 1, match, category_ids, 'price-range': priceRange, fields } = query;
  const offset = limit == -1 ? undefined : (page - 1) * limit;
  const where = {};

  if (match) {
    where[Op.or] = [
      { name: { [Op.like]: `%${match}%` } },
      { description: { [Op.like]: `%${match}%` } }
    ];
  }
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    where.price = { [Op.between]: [min, max] };
  }

  const include = [
    { model: ProductImage, as: 'images' },
    { model: ProductOption, as: 'options' }
  ];
  if (category_ids) {
    include.push({
      model: Category,
      as: 'categories',
      where: { id: category_ids.split(',') },
      through: { attributes: [] }
    });
  }

  const result = await Product.findAndCountAll({ where, include, limit: limit == -1 ? undefined : +limit, offset, distinct: true });

  const data = result.rows.map(p => {
    const item = p.toJSON();
    item.images = item.images?.map(i => ({ id: i.id, content: i.path }));
    item.category_ids = item.categories?.map(c => c.id);
    if (fields) {
      const f = fields.split(',');
      const filtered = {};
      f.forEach(k => (filtered[k] = item[k]));
      filtered.id = item.id;
      return filtered;
    }
    return item;
  });

  return { data, total: result.count, limit: +limit, page: +page };
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      { model: ProductImage, as: 'images' },
      { model: ProductOption, as: 'options' },
      { model: Category, as: 'categories', through: { attributes: [] } }
    ]
  });
  if (!product) return null;
  const item = product.toJSON();
  item.images = item.images.map(i => ({ id: i.id, content: i.path }));
  item.category_ids = item.categories.map(c => c.id);
  return item;
};

module.exports = {
  getProducts,
  getProductById
};