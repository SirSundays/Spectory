const express = require("express");
const router = express.Router();
const orderRequestController = require("../controller/orderRequestController");

router.get("/all", keycloak.protect("realm:basic"), orderRequestController.getAll);
router.get("/all/search", keycloak.protect("realm:basic"), orderRequestController.getSearch);
router.get("/oneSpecific", keycloak.protect("realm:basic"), orderRequestController.getOneSpecific);
router.get("/importRequest", keycloak.protect("realm:basic"), orderRequestController.searchImportRequest);
router.post("/new_request", keycloak.protect("realm:basic"), orderRequestController.newRequest);
router.put("/request", keycloak.protect("realm:admin"), orderRequestController.updateRequest);

module.exports = router;