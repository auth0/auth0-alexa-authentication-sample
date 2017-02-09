"use strict";

const url = require("url");

const Express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const elemental = require("./../elemental-db.js");

module.exports = function () {
  let router = Express.Router();

  router.use("/", (req, res, next) => {
    // Ensure that database is available at the request level
    var schema = {
      config: { type: "singleton" },
      sessions: { type: "map" },
      orders: { type: "map" },
      pending_orders: { type: "map" },
    };

    var seed = { config: {}, sessions: {}, orders: {}, pending_orders: {} };

    if (req.webtaskContext.storage) {
      req.db = new elemental.WebtaskStorageElementalDB(req.webtaskContext.storage, schema, seed);
    } else {
      req.db = new elemental.JsonFileElementalDB("local-db.json", schema, seed);
    }

    // Provide base path, absolute URL and absolute base URL
    function escape(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    req.basePath = url.parse(req.originalUrl).pathname.replace(new RegExp(escape(url.parse(req.url).pathname) + "$"), "");

    var xfproto = req.get('x-forwarded-proto');
    var xfport = req.get('x-forwarded-port');

    req.absoluteUrl = [
      xfproto ? xfproto.split(',')[0].trim() : 'https',
      '://',
      req.get('Host'),
      //xfport ? ':' + xfport.split(',')[0].trim() : '',
      url.parse(req.originalUrl).pathname
    ].join('');

    req.absoluteBaseUrl = [
      xfproto ? xfproto.split(',')[0].trim() : 'https',
      '://',
      req.get('Host'),
      //xfport ? ':' + xfport.split(',')[0].trim() : '',
      req.basePath
    ].join('');

    // Make the global configuration available at the request level
    req.db.get(function (error, data) {
      if (error) { return next(error); }

      req.config = data.config;

      next();
    });
  });

  return router;
}