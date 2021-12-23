const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const routes = require("../api/routes/v1");
const webRoutes = require("../api/routes/web");
const { logs } = require("./vars");
const strategies = require("./passport");
const path = require("path");
const error = require("../api/middlewares/error");
const supportHelper = require("../views/helpers/helper");

var mqttHandler = require("../mqtt_handler");
const exphbs = require("express-handlebars");

const mqttClient = new mqttHandler();

mqttClient.connect();

/**
 * Express instance
 * @public
 */
const app = express();
const publicDirectory = path.join(__dirname, "../public");
const viewDirectory = path.join(publicDirectory, "views");

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: supportHelper.helpers,

    // viewEngine: {
    //   extName: ".hbs",
    //   partialsDir: path.join(viewDirectory, "partials"),
    //   layoutsDir: path.join(viewDirectory, "layouts"),
    //   defaultLayout: "main.hbs",
    // },
    viewPath: viewDirectory,
  })
);

//set engine hbs as view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));

app.locals.mqttClient = mqttClient;

app.use(express.static(publicDirectory));

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use("jwt", strategies.jwt);
passport.use("facebook", strategies.facebook);
passport.use("google", strategies.google);

// mount api v1 routes
app.use("/v1", routes);
app.use("/", webRoutes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
