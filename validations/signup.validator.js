const { check, body } = require("express-validator");

const signupValid = () => {
  return [
    [
      check("Email").trim().isEmail().withMessage("please enter valid email."),
      check("Password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("password can not be empty")
        .isLength({ min: 8 })
        .withMessage("password length should not be less than 8 characters."),
    ],
  ];
};

module.exports = {
  signupValid,
};
