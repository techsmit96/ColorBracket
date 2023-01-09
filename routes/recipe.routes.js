const express = require("express");
const {
  addRecipe,
  updateRecipe,
  getRecipe,
  getRecipeList,
  deleteRecipe,
  getDetailedRecipe,
} = require("../controllers/recipe.controller");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const recipeValid = require(`../validations/recipe.validator`);
var multer = require("multer");
const DIR = "./uploads/";

const whitelistImage = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

let storageIndividual = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + ".png";

    req.filename = DIR + "/" + filename;
    cb(null, filename);
  },
});
let uploadIndividual = multer({
  storage: storageIndividual,
  fileFilter: (req, file, cb) => {
    if (!whitelistImage.includes(file.mimetype)) {
      req.file_error = 1;
      return cb(null, false);
    }
    cb(null, true);
  },
});

//CRUD OPERATIONS START
router.post(
  "/addRecipe",
  protect,
  uploadIndividual.fields([{ name: "RecipeImage", maxCount: 1 }]),
  addRecipe
);
router.post(
  "/updateRecipe",
  protect,
  uploadIndividual.fields([{ name: "RecipeImage", maxCount: 1 }]),
  updateRecipe
);
router.post("/getRecipe", recipeValid.idValid(), protect, getRecipe);
router.post(
  "/getDetailedRecipe",
  recipeValid.idValid(),
  protect,
  getDetailedRecipe
);
router.post("/getRecipeList", protect, getRecipeList);
router.post("/deleteRecipe", recipeValid.idValid(), protect, deleteRecipe);

//CRUD END

module.exports = router;
