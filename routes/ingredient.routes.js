const express = require("express");
const {
  addIngredient,
  updateIngredient,
  getIngredient,
  getIngredientList,
  deleteIngredient,
} = require("../controllers/ingredients.controller");

const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

//CRUD OPERATIONS START
router.post("/addIngredient", protect, addIngredient);
router.post("/updateIngredient", protect, updateIngredient);
router.post("/getIngredient", protect, getIngredient);
router.post("/getIngredientList", protect, getIngredientList);
router.post("/deleteIngredient", protect, deleteIngredient);

//CRUD END

module.exports = router;
