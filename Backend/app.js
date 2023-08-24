const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require("dotenv").config({ path: "backend/config/config.env" });

//using middlewares
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }))

//import routes
const user = require('./routes/user');
const post = require('./routes/post');

//using routes
app.use("/api/v1", user);
app.use("/api/v1", post);


module.exports = app;

