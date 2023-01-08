var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const asyncHandler = require("../middleware/async");
const db = require("../models");
const ErrorResponse = require("../utils/error_response");
const { getPagination, getPagingData } = require("../utils/pagination");
const { validateInput } = require("../utils/validation_result");
const excel = require("node-excel-export");
const { stylesData } = require("../utils/excel_export_style");

exports.addSubject = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    let subjectItem = {
      Code: req.body.Code,
      Name: req.body.Name,
      Description: req.body.Description != "" ? req.body.Description : null,
      Created_By: req.user.ID,
    };
    const subject = await db.subject.create(subjectItem);

    res.status(200).json({
      success: true,
      message: `New Subject Added successfully.`,
    });
  }
});

exports.updateSubject = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    let subjectItem = {
      Code: req.body.Code,
      Name: req.body.Name,
      Description: req.body.Description != "" ? req.body.Description : null,
      Updated_By: req.user.ID,
    };

    const subject = await db.subject.update(subjectItem, {
      where: {
        ID: req.body.ID,
      },
    });

    if (subject == 0) {
      return next(new ErrorResponse(`Subject details not found.`, 500));
    }
    res.status(200).json({
      success: true,
      message: `Subject Updated Successfully`,
    });
  }
});

exports.getSubject = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const subjectItem = await db.subject.findOne({
      where: {
        ID: req.body.ID,
      },
    });

    if (subjectItem == null) {
      return next(new ErrorResponse(`Subject details not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Subject found.`,
      data: subjectItem,
    });
  }
});
exports.getSubjectList = asyncHandler(async (req, res, next) => {
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
  const subjectList = await db.subject.findAndCountAll({
    where: condition,
    limit,
    offset,
    order: ["Name"],
    attributes: ["ID", "Code", "Name", "Description", "Status"],
  });
  if (subjectList) {
    let { total, data, totalPages, currentPage } = getPagingData(
      subjectList,
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
exports.deleteSubject = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const subjectItem = await db.subject.update(
      {
        Deleted_By: req.user.ID,
        Deleted_At: Date.now(),
      },
      {
        where: {
          ID: req.body.ID,
        },
      }
    );

    if (subjectItem == 0) {
      return next(new ErrorResponse(`Subject not found.`, 500));
    }

    res.status(200).json({
      success: true,
      message: `Subject deleted.`,
      data: subjectItem,
    });
  }
});

exports.getAllSubjects = asyncHandler(async (req, res, next) => {
  const allSubjects = await db.subject.findAll({
    order: ["Name"],
    attributes: ["Id", "Name"],
  });
  res.status(200).json({
    success: true,
    data: allSubjects,
  });
});

exports.getSubjectsExport = asyncHandler(async (req, res, next) => {
  const styles = stylesData();
  const heading = [[{ value: "Subject Master", style: styles.topHeader }]];

  let specification = {
    Sr_No: {
      displayName: "Sr No",
      headerStyle: styles.tableHeader,
      cellStyle: styles.cellInteger,
      width: 50,
    },
    Subject_Name: {
      displayName: "Subject Name",
      headerStyle: styles.tableHeader,
      cellStyle: styles.cellBorder,
      width: 200,
    },
  };
  let condition = {};
  if (req.body.Search != "") {
    condition.Name = {
      [Op.like]: `${req.body.Search}%`,
    };
  }
  const subjectsData = await db.subject.findAll({
    where: condition,
    order: ["Name"],
  });

  let subjectDataList = [];
  let count = 1;
  for (let i = 0; i < subjectsData.length; i++) {
    let subjectsDataItem = {
      Sr_No: count,
      Subject_Name: subjectsData[i].dataValues.Name,
    };
    subjectDataList.push(subjectsDataItem);
    count = count + 1;
  }
  const dataset = subjectDataList;

  const merges = [
    {
      start: { row: 1, column: 1 },
      end: { row: 1, column: Object.keys(specification).length },
    },
  ];
  const report = excel.buildExport([
    {
      name: "Subject Report",
      heading: heading,
      merges: merges,
      specification: specification,
      data: dataset,
    },
  ]);
  res.attachment("Subject.xlsx");
  return res.send(report);
  // if (subjectsData) {
  // 	res.status(200).json({
  // 		success: true,
  // 		data: subjectsData,
  // 	});
  // } else {
  // 	res.status(200).json({
  // 		success: true,
  // 		data: [],
  // 	});
  // }
});
