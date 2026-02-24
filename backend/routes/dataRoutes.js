// routes/dataRoutes.js
const express = require("express");
const dataController = require("../controllers/dataController");
const router = express.Router();

router.post("/login", dataController.login);
router.post('/verify-otp', dataController.verifyOtp);
router.post("/signup", dataController.signUp);
router.get("/", dataController.getAllData);
router.post("/add", dataController.addData);
router.post("/UpdExpensesDetails", dataController.UpdExpensesDetails);
router.post("/delete", dataController.deleteData);
router.get("/get", dataController.getType)
router.post("/deleteExpense", dataController.deleteExpense)


module.exports = router;
     