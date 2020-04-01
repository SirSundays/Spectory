const express = require("express");
const router = express.Router();
const userController = require('../controller/userController');

router.get("/fullname", keycloak.protect("realm:basic"), userController.getFullName);

module.exports = router;