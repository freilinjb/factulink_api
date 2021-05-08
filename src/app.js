const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const router = require("./routes/index");

const pkg = require('../package.json');
const app = express();


//Settings
app.set('port', process.env.PORT || 4000 );
app.set("pkg", pkg);


//Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Welcome Routes
app.get("/", (req, res) => {
    res.json({
      message: "Welcome to FactuLink API",
      name: app.get("pkg").name,
      version: app.get("pkg").version,
      description: app.get("pkg").description,
      author: app.get("pkg").author,
    });
  });

//Router
// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    next();
  });

app.use("/api", router);


module.exports = app;