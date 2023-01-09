"use strict";

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "ingredients",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Items: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      Amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Unit: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      Recipe_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 301,
      freezeTableName: true,
      engine: "InnoDB",
      charset: "utf8mb4",
      // underscored: true,
      paranoid: true,
      timestamps: true,
      createdAt: "Created_At",
      updatedAt: "Updated_At",
      deletedAt: "Deleted_At",
      individualHooks: true,
    }
  );

  return model;
};
