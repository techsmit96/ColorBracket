const { check, body } = require("express-validator");

const signupValid = () => {
  return [
    [
      check("Username")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Username can not be empty")
        .isLength({ min: 2 })
        .withMessage("Username length should not be less than 2 characters."),
      check("Password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password can not be empty")
        .isLength({ min: 2 })
        .withMessage("Password length should not be less than 2 characters."),
    ],
  ];
};

module.exports = {
  signupValid,
};
