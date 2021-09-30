/**
 * Module dependencies.
 */

var express = require("express"),
  http = require("http"),
  path = require("path"),
  favicon = require("serve-favicon"),
  logger = require("morgan"),
  methodOverride = require("method-override");

const root = path.join(__dirname, "client", "build");
var app = express();

app.set("port", process.env.PORT || 3333);
app.use(favicon(__dirname + "/client/public/favicon.png"));
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));

if (app.get("env") == "development") {
  app.locals.pretty = true;
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use(express.static(root));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root });
});

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
