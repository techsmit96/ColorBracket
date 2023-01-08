const express = require("express");
const {
  addSubject,
  updateSubject,
  getSubject,
  getSubjectList,
  deleteSubject,
  getAllSubjects,
  getSubjectsExport,
} = require("../controllers/subject.controller");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const subjectValid = require(`../validations/subject.validator`);

//CRUD OPERATIONS START
router.post(
  "/addSubject",
  subjectValid.saveValid(),
  protect,
  authorize(process.env.ADMIN),
  addSubject
);
router.post(
  "/updateSubject",
  subjectValid.updateValid(),
  protect,
  authorize(process.env.ADMIN),
  updateSubject
);
router.post(
  "/getSubject",
  subjectValid.idValid(),
  protect,
  authorize(process.env.ADMIN),
  getSubject
);
router.post(
  "/getSubjectList",
  protect,
  authorize(process.env.ADMIN),
  getSubjectList
);
router.post(
  "/deleteSubject",
  subjectValid.idValid(),
  protect,
  authorize(process.env.ADMIN),
  deleteSubject
);

//CRUD END
router.post(
  "/getAllSubjects",
  protect,
  authorize(process.env.ADMIN),
  getAllSubjects
);
router.post(
  "/getSubjectsExport",
  protect,
  authorize(process.env.ADMIN),
  getSubjectsExport
);

module.exports = router;
