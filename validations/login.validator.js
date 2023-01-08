const { check, body } = require("express-validator");

const loginValid = () => {
  return [
    [
      check("username")
        .trim()
        .isEmail()
        .withMessage("please enter valid email."),
      check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("password can not be empty")
        .isLength({ min: 8 })
        .withMessage("password length should not be less than 8 characters"),
    ],
  ];
};

module.exports = {
  loginValid,
};
