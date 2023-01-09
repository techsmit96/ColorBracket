var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const asyncHandler = require("../middleware/async");
const db = require("../models");
const ErrorResponse = require("../utils/error_response");
const { getPagination, getPagingData } = require("../utils/pagination");
const { validateInput } = require("../utils/validation_result");

exports.addIngredient = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const ingredient = await db.ingredients.create(req.body);

    res.status(200).json({
      success: true,
      message: `New ingredient added successfully.`,
    });
  }
});

exports.updateIngredient = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const ingredient = await db.ingredients.update(req.body, {
      where: {
        ID: req.body.ID,
      },
    });

    if (ingredient == 0) {
      return next(new ErrorResponse(`Ingredient details not found.`, 500));
    }
    res.status(200).json({
      success: true,
      message: `Ingredient Updated Successfully`,
    });
  }
});

exports.getIngredient = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const ingredient = await db.ingredients.findOne({
      where: {
        ID: req.body.ID,
      },
    });

    if (ingredient == null) {
      return next(new ErrorResponse(`Ingredient details not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Ingredient found.`,
      data: ingredient,
    });
  }
});
exports.getIngredientList = asyncHandler(async (req, res, next) => {
  const { limit, offset } = getPagination(
    req.body.PageNumber,
    req.body.NumberOfRows
  );
  let condition = "";
  if (req.body.Search) {
    condition = req.body.Search
      ? { Items: { [Op.like]: `${req.body.Search}%` } }
      : null;
  }
  const ingredientList = await db.ingredients.findAndCountAll({
    where: condition,
    limit,
    offset,
    order: ["Items"],
    attributes: ["ID", "Items", "Amount", "Unit"],
  });
  if (ingredientList) {
    let { total, data, totalPages, currentPage } = getPagingData(
      ingredientList,
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
exports.deleteIngredient = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const ingredientItem = await db.ingredients.destroy({
      where: {
        ID: req.body.ID,
      },
    });

    if (ingredientItem == 0) {
      return next(new ErrorResponse(`Ingredient not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Ingredients deleted.`,
    });
  }
});
