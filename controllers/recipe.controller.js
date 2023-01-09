var express = require("express");
var router = express.Router();
const { QueryTypes, Op } = require("sequelize");
const asyncHandler = require("../middleware/async");
const db = require("../models");
const ErrorResponse = require("../utils/error_response");
const { getPagination, getPagingData } = require("../utils/pagination");
const { validateInput } = require("../utils/validation_result");

exports.addRecipe = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    if (req.file_error == 1) {
      return next(new ErrorResponse(`Please check image extension.`, 500));
    }
    const recipeItem = {
      Name: req.body.Name,
      Description: req.body.Description,
      Image_URL: req.files["RecipeImage"]
        ? req.files["RecipeImage"][0].path
        : "",
      Creator_ID: req.user.ID,
    };

    const recipe = await db.recipe.create(recipeItem);

    res.status(200).json({
      success: true,
      message: `New recipe added successfully.`,
    });
  }
});

exports.updateRecipe = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    let recipeItem = {
      Name: req.body.Name,
      Description: req.body.Description,
    };
    if (req.file_error == 1) {
      return next(new ErrorResponse(`Please check image extension.`, 500));
    }
    if (req.files["RecipeImage"]) {
      recipeItem = {
        ...recipeItem,
        Image_URL: req.files["RecipeImage"][0].path,
      };
    }

    const recipe = await db.recipe.update(recipeItem, {
      where: {
        ID: req.body.ID,
      },
    });

    if (recipe == 0) {
      return next(new ErrorResponse(`Recipe details not found.`, 500));
    }
    res.status(200).json({
      success: true,
      message: `Recipe Updated Successfully`,
    });
  }
});

exports.getRecipe = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const recipeItem = await db.recipe.findOne({
      where: {
        ID: req.body.ID,
      },
      attributes: ["ID", "Name", "Description", "Image_URL"],
      include: [
        {
          model: db.user,
          attributes: [["Name", "CreatorName"]],
        },
      ],
      raw: true,
    });

    if (recipeItem == null) {
      return next(new ErrorResponse(`Recipe details not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Recipe found.`,
      data: recipeItem,
    });
  }
});
exports.getRecipeList = asyncHandler(async (req, res, next) => {
  const { limit, offset } = getPagination(
    req.body.PageNumber,
    req.body.NumberOfRows
  );
  let condition = "";
  if (req.body.Search) {
    condition = req.body.Search
      ? { Name: { [Op.like]: `${req.body.Search}%` } }
      : null;
  }
  const recipeList = await db.recipe.findAndCountAll({
    where: condition,
    limit,
    offset,
    order: ["Name"],
    attributes: ["ID", "Name", "Description", "Image_URL"],
    include: [
      {
        model: db.user,
        attributes: [["Name", "CreatorName"]],
      },
    ],
    raw: true,
  });
  if (recipeList) {
    let { total, data, totalPages, currentPage } = getPagingData(
      recipeList,
      req.body.PageNumber,
      req.body.NumberOfRows
    );
    res.status(200).json({
      error: false,
      total,
      data,
      totalPages,
      currentPage,
    });
  } else {
    res.status(200).json({
      error: false,
      data: {},
    });
  }
});
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const recipeItem = await db.recipe.destroy({
      where: {
        ID: req.body.ID,
      },
    });

    if (recipeItem == 0) {
      return next(new ErrorResponse(`Recipe not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Recipe deleted.`,
    });
  }
});

exports.getDetailedRecipe = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const recipeItem = await db.sequelize
      .query(
        `Select r.ID,r.Name,r.Description,r.Image_URL, u.Name As CreatorName 
        from recipe r LEFT JOIN users u ON u.ID = r.Creator_ID where r.ID = ${req.body.ID};`,
        {
          type: QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        res.status(500).json({
          error: true,
          message: "Server error..!!",
        });
      });
    const ingredientItem = await db.sequelize
      .query(
        `Select Items,Amount,Unit
        from ingredients where Recipe_ID = ${req.body.ID};`,
        {
          type: QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        res.status(500).json({
          error: true,
          message: "Server error..!!",
        });
      });
    const processItem = await db.sequelize
      .query(`Select Step from process where Recipe_ID= ${req.body.ID};`, {
        type: QueryTypes.SELECT,
      })
      .catch((e) => {
        res.status(500).json({
          error: true,
          message: "Server error..!!",
        });
      });


    if (recipeItem == null) {
      return next(new ErrorResponse(`Recipe details not found.`, 500));
    }
    let dummyData = recipeItem.reduce((acc, d) => {
      const found = acc.find((a) => a.ID === d.ID);

      if (!found) {
        acc.push({
          ID: d.ID,
          Name: d.Name,
          Description: d.Description,
          Image_URL: d.Image_URL,
          CreatorName: d.CreatorName,

          ingredient: ingredientItem,
          Steps: processItem,
        });
      } else {
        found.Steps.push(processItem);
      }
      return acc;
    }, []);
    res.status(200).json({
      success: true,
      message: `Recipe found.`,
      data: dummyData[0],
    });
  }
});
