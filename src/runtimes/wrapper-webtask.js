"use strict";

const zlib = require("zlib");

const Express = require("express");

const Webtask = require("webtask-tools");

const files = require("./../files.json");
const core = require("./../server/routers/core-router.js");
const website = require("./../server/routers/website-router.js");
const alexa = require("./../server/routers/alexa-router.js");
const api = require("./../server/routers/api-router.js");
const ApplicationPaths = require("./../server/application-paths");

var fileData = {
  "index.html": zlib.unzipSync(new Buffer(files["index.html"], "base64"), 'utf-8').toString('utf8'),
  "scripts.js": zlib.unzipSync(new Buffer(files["scripts.js"], "base64"), 'utf-8').toString('utf8'),
  "styles.css": zlib.unzipSync(new Buffer(files["styles.css"], "base64"), 'utf-8').toString('utf8'),
  "logo.svg": zlib.unzipSync(new Buffer(files["logo.svg"], "base64"), 'utf-8').toString('utf8')
};

var app = new Express();

app.use("/", core());
app.use(`/${ApplicationPaths.WEB}/`, website(fileData));
app.use(`/${ApplicationPaths.ALEXA_SKILL}/`, alexa());
app.use(`/${ApplicationPaths.API}/`, api());

module.exports = Webtask.fromExpress(app);