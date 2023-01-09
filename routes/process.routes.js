const express = require("express");
const {
  addProcess,
  updateProcess,
  getProcess,
  getProcessList,
  deleteProcess,
} = require("../controllers/process.controller");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

//CRUD OPERATIONS START
router.post("/addProcess", protect, addProcess);
router.post("/updateProcess", protect, updateProcess);
router.post("/getProcess", protect, getProcess);
router.post("/getProcessList", protect, getProcessList);
router.post("/deleteProcess", protect, deleteProcess);

//CRUD END

module.exports = router;
