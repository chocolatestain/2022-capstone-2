const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('memo', {
    memo_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "idx"
    },
    content: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "내용"
    },
    writer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "작성자idx",
      references: {
        model: 'member',
        key: 'member_id'
      }
    }
  }, {
    sequelize,
    tableName: 'memo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "memo_id" },
        ]
      },
      {
        name: "writer_id",
        using: "BTREE",
        fields: [
          { name: "writer_id" },
        ]
      },
    ]
  });
};
