"use strict";

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "recipe",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Image_URL: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Creator_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 201,
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
