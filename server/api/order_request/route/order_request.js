const express = require("express");
const router = express.Router();
const orderRequestController = require("../controller/orderRequestController");

router.get("/all", keycloak.protect("realm:basic"), orderRequestController.getAll);
router.post("/new_request", keycloak.protect("realm:admin") orderRequestController.newRequest)

module.exports = router;