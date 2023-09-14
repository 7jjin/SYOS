'use strict';

const Sequelize = require('sequelize');
// const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')["production"];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = require('./User')(sequelize);
db.Post = require('./Post')(sequelize);
db.Like = require('./Like')(sequelize);
db.Comment = require('./Comment')(sequelize);
db.Product = require('./Product')(sequelize);

// 외래키 관계 설정
db.User.hasMany(db.Post, { foreignKey: 'user_id' });
db.Post.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Like, { foreignKey: 'user_id' });
db.Like.belongsTo(db.User, { foreignKey: 'user_id' });

db.Post.hasMany(db.Like, { foreignKey: 'post_id', onDelete: 'CASCADE' });
db.Like.belongsTo(db.Post, { foreignKey: 'post_id', onDelete: 'CASCADE' });

db.User.hasMany(db.Comment, { foreignKey: 'user_id' });
db.Comment.belongsTo(db.User, { foreignKey: 'user_id' });

db.Post.hasMany(db.Comment, { foreignKey: 'post_id', onDelete: 'CASCADE' });
db.Comment.belongsTo(db.Post, { foreignKey: 'post_id', onDelete: 'CASCADE' });

db.Post.hasMany(db.Product, { foreignKey: 'post_id', onDelete: 'CASCADE' });
db.Product.belongsTo(db.Post, { foreignKey: 'post_id', onDelete: 'CASCADE' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
