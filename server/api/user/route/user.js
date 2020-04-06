const express = require("express");
const router = express.Router();
const userController = require('../controller/userController');

router.get("/allBasicUser", keycloak.protect("realm:basic"), userController.searchAllBasicUser);
router.get("/allPurchaserUser", keycloak.protect("realm:basic"), userController.searchAllPurchaserUser);

module.exports = router;