const { DataTypes, Sequelize } = require('sequelize');

const Upload = (sequelize) => {
  return sequelize.define('upload', {
    post_id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    writer: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    tag: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = Upload;
