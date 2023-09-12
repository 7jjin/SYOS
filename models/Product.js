const { DataTypes } = require('sequelize');

const Product = (sequelize) => {
  return sequelize.define('product', {
    // Post에서 사용되는 외래키로 설정
    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    product_link: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    top: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    left: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = Product;
