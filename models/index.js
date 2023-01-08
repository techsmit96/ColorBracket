"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // const model = sequelize['import'](path.join(__dirname, file));
    // const model = require(path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Associations

//permissions
// db.test.hasMany(db.test_subject_item, { foreignKey: "Test_ID" });

// //test foreign key
// db.test_questions.belongsTo(db.test, {
//   foreignKey: "Test_ID",
//   sourceKey: "ID",
// });
// db.test_subject_marks.belongsTo(db.test, {
//   foreignKey: "Test_ID",
//   sourceKey: "ID",
// });
// db.test_user_mapping.belongsTo(db.test, {
//   foreignKey: "Test_ID",
//   sourceKey: "ID",
// });
// db.test_user_question_attempt.belongsTo(db.test, {
//   foreignKey: "Test_ID",
//   sourceKey: "ID",
// });

// //subject foreign key
// db.test_subject_marks.belongsTo(db.subject, {
//   foreignKey: "Subject_ID",
//   sourceKey: "ID",
// });
// db.test_subject_item.belongsTo(db.subject, {
//   foreignKey: "Subject_ID",
//   sourceKey: "ID",
// });
// db.question_bank.belongsTo(db.subject, {
//   foreignKey: "Subject_ID",
//   sourceKey: "ID",
// });

// //user foreign key
// db.test_subject_marks.belongsTo(db.user, {
//   foreignKey: "User_ID",
//   sourceKey: "ID",
// });
// db.test_user_mapping.belongsTo(db.user, {
//   foreignKey: "User_ID",
//   sourceKey: "ID",
// });
// db.test_user_question_attempt.belongsTo(db.user, {
//   foreignKey: "User_ID",
//   sourceKey: "ID",
// });

// //question foreign key
// db.test_questions.belongsTo(db.question_bank, {
//   foreignKey: "Question_ID",
//   sourceKey: "ID",
// });
// db.test_user_question_attempt.belongsTo(db.question_bank, {
//   foreignKey: "Question_ID",
//   sourceKey: "ID",
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;