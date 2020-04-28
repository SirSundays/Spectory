const express = require("express");
const config = require('config');
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const app = express();

jwt = require('jsonwebtoken');
Keycloak = require('keycloak-connect');

mailConfig = config.get('mail');

keycloakConfig = config.get('keycloak');

keycloak = new Keycloak({}, keycloakConfig);
app.use(keycloak.middleware());

//configure database and mongoose
spectoryDb = mysql.createPool(config.get('db'));
// db configuaration ends here

//registering cors
app.use(cors());

//configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//configure body-parser ends here

app.use(morgan("dev")); // configire morgan

const orderRequestRoutes = require("./api/order_request/route/order_request");
app.use("/api/order_request", orderRequestRoutes);

const userRoutes = require("./api/user/route/user");
app.use("/api/user", userRoutes);

const parcelTrackingRoutes = require("./api/parcelTracking/route/parcelTracking");
app.use("/api/parcelTracking", parcelTrackingRoutes);

app.listen(PORT, () => {
  // console.log(`App is running on ${PORT}`);
});