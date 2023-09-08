const { DataTypes, Sequelize } = require('sequelize');

const Like = (sequelize) => {
  return sequelize.define('like', {
    like_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    // 게시글 ID를 참조하는 외래 키
    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    // 사용자 ID를 참조하는 외래 키
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: false,  
  });
};

module.exports = Like;
