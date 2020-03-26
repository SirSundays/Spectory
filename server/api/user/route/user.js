const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const auth = require("../../../config/auth");
const advancedAuth = require("../../../config/advancedAuth");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);

module.exports = router;