"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV;
const config = require(__dirname + "/../config/config.json")[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = require("./User")(sequelize);
db.Post = require("./Post")(sequelize);
db.Like = require("./Like")(sequelize);
db.Comment = require("./Comment")(sequelize);

// 외래키 관계 설정
db.User.hasMany(db.Like, { foreignKey: 'user_id' });
db.Like.belongsTo(db.User, { foreignKey: 'user_id' });
db.Post.hasMany(db.Like, { foreignKey: 'post_id' });
db.Like.belongsTo(db.Post, { foreignKey: 'post_id' });

db.User.hasMany(db.Comment, {foreignKey: 'user_id'});
db.Comment.belongsTo(db.User,{foreignKey: 'user_id'});
db.Post.hasMany(db.Comment, { foreignKey: 'post_id' });
db.Comment.belongsTo(db.Post, { foreignKey: 'post_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
