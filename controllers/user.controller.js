const db = require("../models");
const ErrorResponse = require("../utils/error_response");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/async");
const EmailSender = require("../utils/send_email");
const { validateInput } = require("../utils/validation_result");
const { getPagination, getPagingData } = require("../utils/pagination");
const { QueryTypes, Op } = require("sequelize");
const getOTP = require("../utils/otp_generator");
// const excel = require("node-excel-export");
// const { stylesData } = require("../utils/excel_export_style");

//Authentication
exports.signup = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    let item = {
      Name: req.body.Name,
      User_ID: req.body.Username,
      Password: req.body.Password,
    };
    const user = await db.user.create(item);

    res.status(200).json({
      success: true,
      message: `User registered.`,
    });
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const { Username, Password } = req.body;
    console.log(Username, Password);
    // if (!username || !password)
    //   return next(
    //     new ErrorResponse(`Please provide an username and password`),
    //     400
    //   );

    //Check user exist
    const user = await db.user.findOne({
      where: {
        User_ID: Username,
      },
    });

    if (!user) return next(new ErrorResponse(`Invalid credentials`, 400));

    //Match Password
    const isMatch = await user.matchPassword(Password, user.Password);

    if (!isMatch) return next(new ErrorResponse(`Invalid credentials`, 400));

    sendTokenReponse(user, 200, res);
  }
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: `You are successfully logout`,
  });
});

const sendTokenReponse = async (user, statusCode, res) => {
  console.log(user.ID);
  const token = await user.getSignedJwtToken(user.ID);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_PARSER * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
    name: user.Name,
    role: user.User_Type,
    // id: user.id,
  });
};



//CRUD Operations
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { limit, offset } = getPagination(
    req.body.pageNumber,
    req.body.numberOfRows
  );
  let condition = "";
  if (req.body.hasOwnProperty("search")) {
    if (req.body.search != "") {
      condition = req.body.search
        ? {
            Name: {
              [Op.like]: `${req.body.search}%`,
            },
          }
        : null;
    }
  }
  const users = await db.user.findAndCountAll({
    where: condition,
    limit,
    offset,
    order: ["Name"],
  });

  if (users) {
    let { total, data, totalPages, currentPage } = getPagingData(
      users,
      req.body.pageNumber,
      req.body.numberOfRows
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

exports.getUser = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    await db.user
      .findOne({
        where: {
          id: req.body.id,
        },
      })
      .then((data) => {
        if (data) {
          res.send({
            message: "User details found",
            data: data,
            error: false,
          });
        } else {
          return next(new ErrorResponse(`User details not found`, 500));
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const { id } = req.body;
    const user = await db.user.update(req.body, {
      where: {
        id: id,
      },
    });

    if (user == 0) return next(new ErrorResponse(`User not found`, 500));

    res.status(200).json({
      success: true,
      message: `User details updated`,
    });
  }
});
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const errors = validateInput(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp({ sucess: false, data: errors.array() });
  } else {
    const { id } = req.body;
    const user = await db.user.destroy({
      where: {
        id: req.body.id,
      },
    });

    if (user === 0) return next(new ErrorResponse(`User not found`, 500));

    res.status(200).json({
      success: true,
      message: `User deleted`,
    });
  }
});
