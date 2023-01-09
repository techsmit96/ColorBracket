const { check } = require("express-validator");

const idValid = () => {
  return [
    [check("ID").not().isEmpty().withMessage("Recipe id can not be empty")],
  ];
};

module.exports = {
  idValid,
};
