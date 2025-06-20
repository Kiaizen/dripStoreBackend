const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImage = require('../models/ProductImage');
const ProductOption = require('../models/ProductOption');

const getProducts = async (req, res) => {
  try {
    const {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
      'price-range': priceRange,
      ...optionFilters
    } = req.query;

    const offset = (page - 1) * limit;

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

    // Include categories
    const include = [
      {
        model: ProductImage,
        as: 'images',
      },
      {
        model: ProductOption,
        as: 'options',
      },
    ];

    if (category_ids) {
      include.push({
        model: Category,
        as: 'categories',
        where: { id: category_ids.split(',') },
        through: { attributes: [] }
      });
    }

    const products = await Product.findAndCountAll({
      where,
      include,
      limit: limit == -1 ? undefined : parseInt(limit),
      offset: limit == -1 ? undefined : offset,
      distinct: true
    });

    // Limita campos (ex: name,images,price)
    const selectedFields = fields?.split(',');

    const data = products.rows.map((product) => {
      const item = product.toJSON();

      // Ajusta imagem para campo content (exemplo)
      item.images = item.images?.map((img) => ({
        id: img.id,
        content: img.path.startsWith('http') ? img.path : `https://store.com/media/${img.path}`
      }));

      item.category_ids = item.categories?.map((c) => c.id);

      if (selectedFields?.length) {
        const filtered = {};
        selectedFields.forEach(f => filtered[f] = item[f]);
        filtered.id = item.id; // sempre incluir id
        return filtered;
      }

      return item;
    });

    return res.status(200).json({
      data,
      total: products.count,
      limit: Number(limit),
      page: Number(page)
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(400).json({ message: 'Erro na requisição' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
        { model: Category, as: 'categories', through: { attributes: [] } }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const data = product.toJSON();
    data.images = data.images.map((img) => ({
      id: img.id,
      content: img.path.startsWith('http') ? img.path : `https://store.com/media/${img.path}`
    }));
    data.category_ids = data.categories?.map((c) => c.id);

    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno' });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      enabled,
      name,
      slug,
      stock = 0,
      description,
      price,
      price_with_discount,
      category_ids = [],
      images = [],
      options = []
    } = req.body;

    if (!name || !slug || price == null || price_with_discount == null) {
      return res.status(400).json({ message: 'Dados obrigatórios ausentes' });
    }

    const product = await Product.create({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount
    });

    if (category_ids.length) {
      await product.setCategories(category_ids);
    }

    for (const image of images) {
      await ProductImage.create({
        product_id: product.id,
        path: image.content, // substitua por lógica de upload se for base64
        enabled: true
      });
    }

    for (const option of options) {
      await ProductOption.create({
        product_id: product.id,
        title: option.title,
        shape: option.shape,
        radius: option.radius || '0px',
        type: option.type,
        values: Array.isArray(option.values || option.value)
          ? (option.values || option.value).join(',')
          : ''
      });
    }

    return res.status(201).json({ message: 'Produto criado com sucesso', id: product.id });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao criar produto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    const {
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
      category_ids = [],
      images = [],
      options = []
    } = req.body;

    await product.update({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount
    });

    if (category_ids.length) {
      await product.setCategories(category_ids);
    }

    // Imagens
    for (const img of images) {
      if (img.deleted && img.id) {
        await ProductImage.destroy({ where: { id: img.id } });
      } else if (!img.id) {
        await ProductImage.create({
          product_id: product.id,
          path: img.content,
          enabled: true
        });
      }
    }

    // Opções
    for (const opt of options) {
      if (opt.deleted && opt.id) {
        await ProductOption.destroy({ where: { id: opt.id } });
      } else if (opt.id) {
        await ProductOption.update({
          title: opt.title,
          shape: opt.shape,
          radius: opt.radius || '0px',
          type: opt.type,
          values: Array.isArray(opt.values || opt.value)
            ? (opt.values || opt.value).join(',')
            : ''
        }, {
          where: { id: opt.id }
        });
      } else {
        await ProductOption.create({
          product_id: product.id,
          title: opt.title,
          shape: opt.shape,
          radius: opt.radius || '0px',
          type: opt.type,
          values: Array.isArray(opt.values || opt.value)
            ? (opt.values || opt.value).join(',')
            : ''
        });
      }
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao atualizar produto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar produto' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
