var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const asyncHandler = require("../middleware/async");
const db = require("../models");
const ErrorResponse = require("../utils/error_response");
const { getPagination, getPagingData } = require("../utils/pagination");
const { validateInput } = require("../utils/validation_result");

exports.addProcess = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const process = await db.process.create(req.body);

    res.status(200).json({
      success: true,
      message: `New process added successfully.`,
    });
  }
});

exports.updateProcess = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const process = await db.process.update(req.body, {
      where: {
        ID: req.body.ID,
      },
    });

    if (process == 0) {
      return next(new ErrorResponse(`Process details not found.`, 500));
    }
    res.status(200).json({
      success: true,
      message: `Process Updated Successfully`,
    });
  }
});

exports.getProcess = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const processItem = await db.process.findOne({
      where: {
        ID: req.body.ID,
      },
    });

    if (processItem == null) {
      return next(new ErrorResponse(`Process details not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Process found.`,
      data: processItem,
    });
  }
});
exports.getProcessList = asyncHandler(async (req, res, next) => {
  const { limit, offset } = getPagination(
    req.body.PageNumber,
    req.body.NumberOfRows
  );
  let condition = "";
  if (req.body.Search) {
    condition = req.body.Search
      ? { Step: { [Op.like]: `${req.body.Search}%` } }
      : null;
  }
  const processList = await db.process.findAndCountAll({
    where: condition,
    limit,
    offset,
    order: ["Step"],
    attributes: ["ID", "Step"],
  });
  if (processList) {
    let { total, data, totalPages, currentPage } = getPagingData(
      processList,
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
exports.deleteProcess = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const processItem = await db.process.destroy({
      where: {
        ID: req.body.ID,
      },
    });

    if (processItem == 0) {
      return next(new ErrorResponse(`Process not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Process deleted.`,
    });
  }
});
