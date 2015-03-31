// DEFAULTS ========================================================================================
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || "./shared/config";

// IMPORTS =========================================================================================
let Fs = require("fs");
let Path = require("path");
let Http = require("http");
let Util = require("util");
let ChildProcess = require("child_process");
let Config = require("config");
let Nunjucks = require("nunjucks");
let Express = require("express");
let Morgan = require("morgan");
let CookieParser = require("cookie-parser");
let BodyParser = require("body-parser");
let Winston = require("winston");
let WinstonMail = require("winston-mail");
let Moment = require("moment");
let Routes = require("./routes");

// CONFIGS =========================================================================================
let app = Express();
app.set("etag", Config.get("http-use-etag"));

// MIDDLEWARES =====================================================================================
app.use(BodyParser.json());                        // parse application/json
app.use(BodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
/*app.use(cookieParser());*/

app.use(Morgan("dev", {
  skip: function (req, res) {
    return req.originalUrl.includes("/static") || req.originalUrl.includes("/favicon");
  }
}));

// TEMPLATES =======================================================================================
app.set("views", Path.join(__dirname, "templates"));
app.set("view engine", "html");

let nunjucksEnv = Nunjucks.configure("backend/templates", {
  autoescape: true,
  express: app
});

// ROUTES ==========================================================================================
let staticRoutes = Express.static("static", {etag: Config.get("http-use-etag")});

//app.use(favicon(__dirname + "/favicon.ico"));
app.use("/static", staticRoutes);
//app.use("/api", Routes.api);
app.use("/", Routes.app);

app.use(function(req, res, next) {
  res.status(404).render("errors/404.html");
});

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(err.status || 500);
  res.render("errors/500.html", {
    message: err.message,
    error: (app.get("env") == "development") ? err : {}
  });
});

// LOGGING =========================================================================================
let customColors = {
  trace: "white",
  debug: "blue",
  info: "green",
  warn: "yellow",
  fatal: "red"
};

let customLevels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

Winston.addColors(customColors);

let logger = new (Winston.Logger)({
  colors: customColors,
  levels: customLevels,
  transports: [
    new (Winston.transports.Console)({
      level: process.env.NODE_ENV == "development" ? "info" : "warn",
      colorize: true,
      timestamp: function() {
        return Moment();
      },
      formatter: function(options) {
        let timestamp = options.timestamp().format("YYYY-MM-DD hh:mm:ss");
        let level = Winston.config.colorize(options.level, options.level.toUpperCase());
        let message = options.message;
        let meta;
        if (options.meta instanceof Error) {
          meta = "\n  " + options.meta.stack;
        } else {
          meta = Object.keys(options.meta).length ? Util.inspect(options.meta) : "";
        }
        return `${timestamp} ${level} ${message} ${meta}`;
      }
    }),
    //new (Winston.transports.File)({
    //  filename: "somefile.log"
    //})
  ],
});

if (process.env.NODE_ENV == "production") {
  // https://www.npmjs.com/package/winston-mail
  logger.add(Winston.transports.Mail, {
    level: "error",
    host: Config.get("smtp-host"),
    port: Config.get("smtp-port"),
    from: Config.get("mail-robot"),
    to: Config.get("mail-support"),
    subject: "Application Failed",
  });
}

// LISTENERS =======================================================================================
let server = Http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(Config.get("http-port"));

// HELPERS =========================================================================================
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      logger.error(Config.get("http-port") + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(Config.get("http-port") + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  logger.info("Listening on port " + Config.get("http-port"));
}