const { check } = require("express-validator");

const saveValid = () => {
  return [
    [
      check("Code")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Code can not be empty.")
        .isLength({ min: 2, max: 20 })
        .withMessage(
          "Code length should not be less than 2 characters or greater than 20 characters."
        ),
      check("Name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Subject name can not be empty.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
          "Subject name length should not be less than 2 characters or greater than 50 characters."
        ),
      check("Description")
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 50 })
        .withMessage(
          "Description length should not be less than 2 characters or greater than 50 characters"
        ),
    ],
  ];
};
const updateValid = () => {
  return [
    [
      check("ID").not().isEmpty().withMessage("Subject id can not be empty"),
      check("Code")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Code can not be empty.")
        .isLength({ min: 2, max: 20 })
        .withMessage(
          "Code length should not be less than 2 characters or greater than 20 characters."
        ),
      check("Name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Subject name can not be empty.")
        .isLength({ min: 2, max: 50 })
        .withMessage(
          "Subject name length should not be less than 2 characters or greater than 50 characters."
        ),
      check("Description")
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 50 })
        .withMessage(
          "Description length should not be less than 2 characters or greater than 50 characters"
        ),
    ],
  ];
};

const idValid = () => {
  return [
    [check("ID").not().isEmpty().withMessage(" Subject id can not be empty")],
  ];
};

module.exports = {
  saveValid,
  updateValid,
  idValid,
};
