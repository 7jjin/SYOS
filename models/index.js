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

// // 1:N 관계
db.User.hasMany(db.Post, { foreignKey: "user_id" });
db.Post.belongsTo(db.User, { foreignKey: "user_id" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
