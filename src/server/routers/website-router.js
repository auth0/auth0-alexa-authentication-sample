"use strict";

const url = require("url");
const crypto = require("crypto");

const _ = require("lodash");
const Handlebars = require("handlebars");
const request = require("request");
const base64url = require("base64-url");
const Express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

const ApplicationPaths = require("./../application-paths");

Handlebars.registerHelper("template-start", function (id) {
  return new Handlebars.SafeString(`<script type="text/x-template" id="${id}">`);
});

Handlebars.registerHelper("template-end", function () {
  return new Handlebars.SafeString('</script>');
});

module.exports = function (files) {
  let app = new Express();

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/debug", (req, res) => res.json({}));

  app.get("/ping", (req, res) => res.send("PONG"));

  // Process the application root
  app.get("/", session, (req, res) => {
    if (!req.originalUrl.endsWith("/")) {
      res.redirect(req.originalUrl + "/");

      return;
    }

    var data = {
      csrf: req.session ? req.session.csrf : "",
      cid: req.session ? crypto.createHash("sha1").update(req.session.userId).digest("hex") : "",
      pusher: {
        enabled: !!req.webtaskContext.data.PUSHER_KEY,
        key: req.webtaskContext.data.PUSHER_KEY,
        cluster: req.webtaskContext.data.PUSHER_CLUSTER
      }
    };

    res.send(Handlebars.compile(files["index.html"])(data));
  });

  // Process requests to application resources
  app.get("/scripts.js", (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.send(files["scripts.js"]);
  });
  app.get("/styles.css", (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.send(files["styles.css"]);
  });
  app.get("/logo.svg", (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(files["logo.svg"]);
  });

  // Back-end routes
  app.get("/user", session, (req, res) => {
    if (req.session) {
      res.json({ "email": req.session.email, "phone": req.session.phoneNumber });
    } else {
      res.sendStatus(403);
    }
  });

  app.get("/orders", session, (req, res) => {
    if (req.session) {
      req.db.get(function (error, data) {
        if (error) { return next(error); }

        let orders = {
          "pending": data.pending_orders[req.session.userId],
          "confirmed": data.orders[req.session.userId]
        };

        res.json(orders);
      });
    } else {
      res.sendStatus(403);
    }
  });

  app.delete("/orders", session, (req, res) => {
    if (req.session) {
      req.db.update({ orders: [{ id: req.session.userId, value: [] }] }, function (error) {
        if (error) { return next(error); }

        res.sendStatus(200);
      });
    } else {
      res.sendStatus(403);
    }
  });

  // Handle authentication
  app.get("/oidc/start", (req, res) => {
    let domain = req.webtaskContext.data.AUTH0_DOMAIN;
    let clientId = req.webtaskContext.data.APP_CLIENT_ID;
    let redirectUri = `${req.absoluteBaseUrl}/${ApplicationPaths.WEB}/oidc/callback`;

    let state = base64url.escape(crypto.randomBytes(16).toString("base64"));

    res.cookie("state", state, { httpOnly: true, secure: true, path: req.basePath });

    // TODO : Encode redirect URI

    res.redirect(`https://${domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=openid%20email%20phone`);
  });

  app.get("/oidc/callback", (req, res) => {
    let code = req.query.code, state = req.query.state;

    if (!code || !state) {
      res.sendStatus(400);

      return;
    }

    if (state !== req.cookies.state) {
      res.sendStatus(400);

      return;
    }

    res.cookie("state", "", { httpOnly: true, secure: true, path: req.basePath, expires: new Date() });

    request({
      uri: `https://${req.webtaskContext.data.AUTH0_DOMAIN}/oauth/token`,
      json: {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": req.webtaskContext.data.APP_CLIENT_ID,
        "client_secret": req.webtaskContext.data.APP_CLIENT_SECRET,
        "redirect_uri": `${req.absoluteBaseUrl}/${ApplicationPaths.WEB}/oidc/callback`
      },
      method: "POST"
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let idToken = response.body.id_token;

        let claims = jwt.decode(idToken);

        let session = {
          csrf: base64url.escape(crypto.randomBytes(16).toString("base64")),
          userId: claims.sub,
          email: claims.email,
          phoneNumber: claims.phone_number
        };

        let sid = base64url.escape(crypto.randomBytes(32).toString("base64"));

        req.db.add({ sessions: [{ id: sid, value: session }] }, (error) => {
          if (error) { return next(error); }

          res.cookie("sid", sid, { httpOnly: true, secure: true, path: req.basePath });

          res.redirect(`${req.absoluteBaseUrl}/${ApplicationPaths.WEB}/#/orders`);
        });
      } else {
        console.log(`failed token request(${error}) with status code (${response.statusCode})`);

        res.sendStatus(400);
      }
    });
  });

  app.use(function (error, req, res, next) {
    console.log(error);
    res.sendStatus(500);
  })

  return app;
};

function session(req, res, next) {
  req.db.get(function (error, data) {
    if (error) { return next(error); }

    req.session = data.sessions[req.cookies.sid];

    next();
  });
}
