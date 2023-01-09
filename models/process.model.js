"use strict";

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "process",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Step: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Recipe_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      initialAutoIncrement: 401,
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
