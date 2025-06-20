const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'products', key: 'id' }, // usa nome da tabela
    onDelete: 'CASCADE'
  },
  enabled: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  path: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: true,
  tableName: 'product_images'
});

module.exports = ProductImage;
