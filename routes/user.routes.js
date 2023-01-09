const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  login,
  logout,
  signup,
  changePassword,
  forgotPassword,
  updatePassword,
  resendOTP,
  verifyOTP,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const users_valid = require("../validations/users.validator");
const login_valid = require("../validations/login.validator");
const signup_valid = require("../validations/signup.validator");
const change_pass_valid = require("../validations/change_password.validator");
const update_pass_valid = require("../validations/update_password.validator");
const email_valid = require("../validations/email.validator");
const otp_valid = require("../validations/verify_otp.validator");

//authentication routes
router.post("/signup", signup_valid.signupValid(), signup);
router.post("/signin", login_valid.loginValid(), login);
// router.post("/adminLogin", login_valid.loginValid(), adminLogin);
router.post("/logout", protect, logout);

//User Crud Routes
router.post("/", protect, authorize(process.env.ADMIN), getUsers);
router.post(
  "/getUser",
  users_valid.idValid(),
  protect,
  authorize(process.env.ADMIN),
  getUser
);
router.post(
  "/updateUser",
  users_valid.updateValid(),
  protect,
  authorize(process.env.ADMIN),
  updateUser
);
router.post(
  "/deleteUser",
  users_valid.idValid(),
  protect,
  authorize(process.env.ADMIN),
  deleteUser
);

module.exports = router;
