const express = require("express");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config/db");
const app = express();
jwt = require('jsonwebtoken');
Keycloak = require('keycloak-connect');

keycloakConfig = {
  "realm": "Spectory",
  'auth-server-url': 'http://localhost:8000/auth',
  'bearer-only': true,
  'ssl-required': 'external',
  'resource': 'Spectory-Nodejs-Server',
};

keycloak = new Keycloak({}, keycloakConfig);
app.use(keycloak.middleware());

//configure database and mongoose
mongoose.set("useCreateIndex", true);
mongoose
  .connect(config.database, { useNewUrlParser: true })
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log({ database_error: err });
  });
// db configuaration ends here

//registering cors
app.use(cors());

//configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//configure body-parser ends here

app.use(morgan("dev")); // configire morgan

const orderRequestRoutes = require("./api/order_request/route/order_request"); //bring in our user routes
app.use("/api/order_request", orderRequestRoutes);

const userRoutes = require("./api/user/route/user");
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});