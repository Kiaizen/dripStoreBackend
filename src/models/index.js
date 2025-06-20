const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductOption = require('./ProductOption');
const Category = require('./Category');
const ProductCategory = require('./ProductCategory');

// Configura associações

// Produto tem muitas imagens
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Produto tem muitas opções
Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options' });
// (Você deve fazer o mesmo para ProductOption, se tiver associação)

// Produto pertence a muitas categorias (many-to-many)
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: 'categories'
});
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: 'products'
});

module.exports = {
  Product,
  ProductImage,
  ProductOption,
  Category,
  ProductCategory
};
