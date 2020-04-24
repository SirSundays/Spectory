const express = require("express");
const router = express.Router();
const orderRequestController = require("../controller/orderRequestController");

router.get("/all", keycloak.protect("realm:basic"), orderRequestController.getAll);
router.get("/all/search", keycloak.protect("realm:basic"), orderRequestController.getSearch);
router.get("/oneSpecific", keycloak.protect("realm:basic"), orderRequestController.getOneSpecific);
router.get("/importRequest", keycloak.protect("realm:basic"), orderRequestController.searchImportRequest);
router.get("/all/studentRequestTemplates", keycloak.protect("realm:basic"), orderRequestController.getAllStudentRequestTemplates);
router.get("/oneSpecific/studentRequestTemplates", keycloak.protect("realm:basic"), orderRequestController.getOneSpecificTemplate);

router.post("/new_request", keycloak.protect("realm:basic"), orderRequestController.newRequest);
router.post("/new_student_request", keycloak.protect("realm:admin"), orderRequestController.newStudentRequestTemplate);
router.post("/new_student_request_scratch", keycloak.protect("realm:admin"), orderRequestController.newStudentRequestTemplateScratch);

router.put("/request", keycloak.protect("realm:admin"), orderRequestController.updateRequest);
router.put("/template", keycloak.protect("realm:admin"), orderRequestController.updateTemplate);

router.delete("/student_request", keycloak.protect("realm:admin"), orderRequestController.deleteStudentRequestTemplate);

module.exports = router;