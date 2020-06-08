const express = require("express");
const router = express.Router();
const userController = require('../controller/userController');

router.get("/allBasicUser", keycloak.protect("realm:basic"), userController.searchAllBasicUser);
router.get("/allPurchaserUser", keycloak.protect("realm:basic"), userController.searchAllPurchaserUser);
router.get("/allGroups", keycloak.protect("realm:admin"), userController.getAllGroups);
router.post("/newUser", keycloak.protect("realm:admin"), userController.newUser);

module.exports = router;