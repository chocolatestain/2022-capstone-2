const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('test', {
    test_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "idx"
    },
    tester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "검사자idx",
      references: {
        model: 'member',
        key: 'member_id'
      }
    },
    part_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "부품idx",
      references: {
        model: 'part',
        key: 'part_id'
      }
    },
    is_defected: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "불량여부"
    },
    defected_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "불량유형"
    },
    is_fixed: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "조치여부"
    },
    memo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "메모idx",
      references: {
        model: 'memo',
        key: 'memo_id'
      }
    },
    image_url: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "이미지경로"
    }
  }, {
    sequelize,
    tableName: 'test',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "test_id" },
        ]
      },
      {
        name: "tester_id",
        using: "BTREE",
        fields: [
          { name: "tester_id" },
        ]
      },
      {
        name: "part_id",
        using: "BTREE",
        fields: [
          { name: "part_id" },
        ]
      },
      {
        name: "memo_id",
        using: "BTREE",
        fields: [
          { name: "memo_id" },
        ]
      },
    ]
  });
};
