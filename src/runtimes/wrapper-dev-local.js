"use strict";

process.env["NON_WEBTASK_RUNTIME"] = "1";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const fs = require("fs");
const https = require("https");

const Express = require("express");
const ini = require("ini");

const core = require("./../server/routers/core-router.js");
const website = require("./../server/routers/website-router.js");
const alexa = require("./../server/routers/alexa-router.js");
const api = require("./../server/routers/api-router.js");
const ApplicationPaths = require("./../server/application-paths");

const port = 7100;
const root = "wt";

var fileData = {
  "index.html": fs.readFileSync('./src/client/index.html', 'utf-8'),
  "scripts.js": fs.readFileSync('./src/client/scripts.js', 'utf-8'),
  "styles.css": fs.readFileSync('./src/client/styles.css', 'utf-8'),
  "logo.svg": fs.readFileSync('./src/client/logo.svg', 'utf-8')
};

var app = new Express();

app.use(`/${root}/`, (req, res, next) => {
  req.webtaskContext = req.webtaskContext || {};
  req.webtaskContext.data = req.webtaskContext.data || {};

  var config = ini.parse(fs.readFileSync("./src/runtimes/secrets.ini", "utf-8"));

  Object.assign(req.webtaskContext.data, config);

  next();
});

app.use(`/${root}/`, core());
app.use(`/${root}/${ApplicationPaths.WEB}/`, website(fileData));
app.use(`/${root}/${ApplicationPaths.ALEXA_SKILL}/`, alexa());
app.use(`/${root}/${ApplicationPaths.API}/`, api());

var options = {
  key: fs.readFileSync("./src/runtimes/dev-local-cert.key"),
  cert: fs.readFileSync("./src/runtimes/dev-local-cert.crt")
};

var server = https.createServer(options, app).listen(port, function () {
  console.log(`Server started at: https://pod.localtest.me:${port}/${root}/`);
});