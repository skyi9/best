const express = require("express");
const app = express();

require("dotenv").config({ path: "backend/config/config.env" });

//using middlewares
app.use(express.json());

//import routes
const user = require('./routes/user');


//using routes
app.use("/api/v1", user);


module.exports = app;

