const express = require("express");
const router = express.Router();
const parcelTrackingController = require("../controller/parcelTrackingController");

router.get("/all", keycloak.protect("realm:basic"), parcelTrackingController.getAll);
router.get("/all/search", keycloak.protect("realm:basic"), parcelTrackingController.getSearch);
router.get("/oneSpecific", keycloak.protect("realm:basic"), parcelTrackingController.getOneSpecific);
router.post("/new_request_allocate", keycloak.protect("realm:admin"), parcelTrackingController.newRequestAllocate);
router.post("/new_parcel", keycloak.protect("realm:admin"), parcelTrackingController.newParcel);
router.put("/parcel_ordered", keycloak.protect("realm:purchaser"), parcelTrackingController.updateParcelOrdered);
router.put("/parcel_delivered", keycloak.protect("realm:basic"), parcelTrackingController.updateParcelDelivered);
router.put("/parcel_tracking", keycloak.protect("realm:purchaser"), parcelTrackingController.updateParcelTracking);
router.put("/parcel_delivery", keycloak.protect("realm:purchaser"), parcelTrackingController.updateParcelExpectedDelivery);

module.exports = router;