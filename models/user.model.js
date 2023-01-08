"use strict";
/*
Datatypes:- INTEGER,FLOAT,BOOLEAN,STRING(20),TEXT,DATEONLY
*/

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "user",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Profile_Pic: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      Mobile: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      DOB: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      Age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING,
        isAlphaNumeric: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
        },
      },
      User_Type: {
        type: DataTypes.ENUM("Admin", "User"),
        allowNull: false,
        defaultValue: "User",
      },
      OTP: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Status: {
        type: DataTypes.ENUM("Active", "In Active"),
        allowNull: false,
        defaultValue: "Active",
      },
      Created_By: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Updated_By: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Deleted_By: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // freezeTableName: true,
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

  // hooks (create hash password)
  model.beforeCreate(async (user, options) => {
    const salt = bcrypt.genSaltSync(10);
    user.Password = bcrypt.hashSync(user.Password, salt);
  });

  // hooks (create hash Password)
  model.beforeBulkUpdate(async (user, options) => {
    console.log("update", user.attributes.Password);
    if (user.attributes.Password) {
      const salt = bcrypt.genSaltSync(10);
      user.attributes.Password = bcrypt.hashSync(
        user.attributes.Password,
        salt
      );
    }
  });
  // instance methods (crete jwt token)
  model.prototype.getSignedJwtToken = (userId) => {
    return jwt.sign(
      {
        id: userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
  };

  // instance methods (match password)
  model.prototype.matchPassword = async (enteredPassword, Password) => {
    // console.log(this.password);
    return bcrypt.compareSync(enteredPassword, Password);
  };

  return model;
};
