"use strict";

const crypto = require("crypto");

const _ = require("lodash");
const Express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const Pusher = require("pusher");

const expressJwt = require("express-jwt");

const jwt = require("jsonwebtoken");
const auth0 = process.env["NON_WEBTASK_RUNTIME"] === "1" ? require("auth0") : require("auth0@2.1.0");

var pusher = null;

module.exports = function () {
  let router = Express.Router();

  router.use(bodyParser.json());

  router.use((req, res, next) => {
    let check = expressJwt({
      issuer: `https://${req.webtaskContext.data.AUTH0_DOMAIN}/`,
      audience: req.webtaskContext.data.API_ID,
      secret: req.webtaskContext.data.API_SIGNING_KEY
    });

    console.log(`received api request (${req.url})`);
    // console.log(`received api request (${req.url}) with authorization: ${req.get("Authorization")}`);

    // Initialize Pusher instance if applicable
    if (!pusher && req.webtaskContext.data.PUSHER_APPID && req.webtaskContext.data.PUSHER_CLUSTER && req.webtaskContext.data.PUSHER_KEY && req.webtaskContext.data.PUSHER_SECRET) {
      pusher = new Pusher({
        appId: req.webtaskContext.data.PUSHER_APPID,
        cluster: req.webtaskContext.data.PUSHER_CLUSTER,
        key: req.webtaskContext.data.PUSHER_KEY,
        secret: req.webtaskContext.data.PUSHER_SECRET,
        encrypted: true
      });
    }

    check(req, res, next);
  });

  router.use(tokenify, (req, res, next) => {
    var management = new auth0.ManagementClient({
      domain: req.webtaskContext.data.AUTH0_DOMAIN,
      token: req.token
    });

    management.users.get({ "id": req.user.sub, "fields": "email,phone_number,identities,user_metadata" }).then(user => {
      req.user.email = user.email;
      req.user.phone = user.phone_number || (user.user_metadata && user.user_metadata.phone_number);

      var promise = Promise.resolve(1);

      // Ensure passwordless provisioning
      if (req.user.phone) {
        let passwordless = _.find(user.identities, { "provider": "sms" });

        if (!passwordless) {
          console.log(`provisioning SMS passwordless user for (${JSON.stringify(req.user)})`);

          // Create passwordless SMS user
          let user = { "connection": "sms", "phone_number": req.user.phone };

          promise = management.users.create(user).then(user => management.users.link(req.user.sub, { "provider": "sms", "user_id": user.user_id }));
        }
      } else {
        let passwordless = _.find(user.identities, { "provider": "email" });

        if (!passwordless) {
          console.log(`provisioning email passwordless user for (${JSON.stringify(req.user)})`);

          // Create passwordless email user
          let user = { "connection": "email", "email": req.user.email };

          promise = management.users.create(user).then(user => management.users.link(req.user.sub, { "provider": "email", "user_id": user.user_id }));
        }
      }

      return promise.then(() => {
        console.log(`updated user (${JSON.stringify(req.user)})`);

        next();
      });
    }).catch(next);
  });

  router.post("/orders", (req, res, next) => {
    let order = {
      "pizza": req.body,
      "state": "pending",
      "datetime": new Date().toISOString()
    };

    console.log(`received order: ${JSON.stringify(order)}`);

    // Save order to DB
    req.db.add({ pending_orders: [{ id: req.user.sub, value: order }] }, (error) => {
      if (error) { return next(error); }

      let cid = crypto.createHash("sha1").update(req.user.sub).digest("hex");

      if (pusher) { pusher.trigger(`pod-${cid}`, "pending", order); }

      let payload = {
        "send": "code",
        "client_id": req.webtaskContext.data.APP_CLIENT_ID
      };

      let mode;

      if (req.user.phone) {
        mode = "phone";
        payload["connection"] = "sms";
        payload["phone_number"] = req.user.phone;
      } else {
        mode = "email";
        payload["connection"] = "email";
        payload["email"] = req.user.email;
      }

      // Initiate passwordless code
      request({
        uri: `https://${req.webtaskContext.data.AUTH0_DOMAIN}/passwordless/start`,
        json: payload,
        method: "POST"
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json({ "mode": mode });
        } else {
          res.sendStatus(400);
        }
      });
    });
  });

  router.post("/authorize/:code", (req, res, next) => {
    let code = req.params.code;

    if (!code) {
      console.log(`failed to receive authorization code`);

      res.sendStatus(400);

      return;
    }

    // Get order from DB
    req.db.get(function (error, data) {
      if (error) { return next(error); }

      let order = data.pending_orders[req.user.sub];

      if (!order) {
        console.log(`failed to find order associated with user (${req.user.sub})`);

        res.sendStatus(400);

        return;
      }

      let payload = {
        "client_id": req.webtaskContext.data.APP_CLIENT_ID,
        "grant_type": "password",
        "password": code,
        "scope": "openid"
      };

      if (req.user.phone) {
        payload["connection"] = "sms";
        payload["username"] = req.user.phone;
      } else {
        payload["connection"] = "email";
        payload["username"] = req.user.email;
      }

      // Validate passwordless code
      request({
        uri: `https://${req.webtaskContext.data.AUTH0_DOMAIN}/oauth/ro`,
        json: payload,
        method: "POST"
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // Validate ID Token subject
          let token = jwt.decode(response.body.id_token);

          if (!token || token.sub !== req.user.sub) {
            console.log(`mismatch between token user (${token.sub}) and order user (${req.user.sub})`);

            res.sendStatus(400);

            return;
          }

          order.state = "confirmed";

          let confirmed = data.orders[req.user.sub] || [];

          confirmed.push(order);

          var changes = {
            remove: { pending_orders: [{ id: req.user.sub }] },
            update: { orders: [{ id: req.user.sub, value: confirmed }] }
          };

          // Update order in DB
          req.db.mutate(changes, (error) => {
            if (error) { return next(error); }

            let cid = crypto.createHash("sha1").update(req.user.sub).digest("hex");

            if (pusher) { pusher.trigger(`pod-${cid}`, "confirmed", order); }

            res.sendStatus(200);
          });
        } else {
          console.log(`failed to validate the authorization code`);

          res.sendStatus(400);
        }
      });
    });
  });

  return router;
}

function tokenify(req, res, next) {
  var domain = req.webtaskContext.data.AUTH0_DOMAIN;

  request({
    uri: `https://${domain}/oauth/token`,
    json: {
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials',
      client_id: req.webtaskContext.data.APP_CLIENT_ID,
      client_secret: req.webtaskContext.data.APP_CLIENT_SECRET
    },
    method: "POST"
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      req.token = response.body.access_token;

      next();
    } else {
      next(new Error("Failed to obtain management token."));
    }
  });
}