const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('part', {
    part_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "idx"
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "부품명"
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "재고"
    }
  }, {
    sequelize,
    tableName: 'part',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "part_id" },
        ]
      },
    ]
  });
};
