"use strict";

const Express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const ApplicationPaths = require("./../application-paths");

module.exports = function () {
  let router = Express.Router();

  router.use(bodyParser.json());

  router.post("/", (req, res, next) => {
    // TODO : Verify ID

    // TODO : Ensure access token

    let type = req.body && req.body.request && req.body.request.type;

    switch (type) {
      case "LaunchRequest":
        handleLaunchRequest(req, res, next);
        break;

      case "IntentRequest":
        let intent = req.body.request.intent && req.body.request.intent.name;

        switch (intent) {
          case "GetMeSomePizzaIntent":
            handleGetMeSomePizzaIntentRequest(req, res, next);
            break;

          case "AuthorizePizzaOrderIntent":
            handleAuthorizePizzaOrderIntentRequest(req, res, next);
            break;

          default:
            // TODO : Handle unkown error

            res.sendStatus(400);
            break;
        }
        break;

      case "SessionEndedRequest":
        handleSessionEndedRequest(req, res, next);
        break;

      default:
        // TODO : Handle unkown error

        res.sendStatus(400);
        break;
    }
  });

  return router;
}

function handleLaunchRequest(req, res, next) {
  res.json({
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Welcome to Pizza on Demand. How can I help you?"
      },
      "shouldEndSession": false
    },
    "sessionAttributes": {

    }
  });
}

function handleSessionEndedRequest(req, res, next) {
  res.sendStatus(200);
}

function handleGetMeSomePizzaIntentRequest(req, res, next) {
  let size = req.body.request.intent.slots && req.body.request.intent.slots["Size"];

  if (size && size.value) {
    size = size.value;
  } else {
    size = "medium";
  }

  let toppings = req.body.request.intent.slots && req.body.request.intent.slots["Toppings"];

  if (toppings && toppings.value) {
    toppings = toppings.value;
  } else {
    toppings = "ham bacon and pineapple";
  }

  let pizza = { "size": size, "toppings": toppings };

  console.log(`initiating request to (${req.absoluteBaseUrl}/${ApplicationPaths.API}/orders)`);

  request({
    uri: `${req.absoluteBaseUrl}/${ApplicationPaths.API}/orders`,
    headers: {
      "Authorization": `Bearer ${req.body.session.user.accessToken}`
    },
    json: pizza,
    method: "POST"
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(`processed order request`);

      let transport;

      if (response.body.mode === "phone") {
        transport = "in your phone";
      } else {
        transport = "in your email";
      }

      res.json({
        "version": "1.0",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": `I have received your pizza request. Authorize the transaction using the code received ${transport}.`
          },
          "reprompt": {
            "outputSpeech": {
              "type": "PlainText",
              "text": `If you still haven't received the code ${transport} you can later authorize this request by saying operation pizza is a go and then the code.`
            }
          },
          "shouldEndSession": false
        },
        "sessionAttributes": {

        }
      });
    } else {
      console.log(`failed order request (${response.statusCode}|${error})`);
      
      res.json({
        "version": "1.0",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Failed to process order."
          },
          "shouldEndSession": true
        }
      });
    }
  });
}

function handleAuthorizePizzaOrderIntentRequest(req, res, next) {
  let code = req.body.request.intent.slots && req.body.request.intent.slots["Code"];

  if (!code || !code.value) {
    res.json({
      "version": "1.0",
      "response": {
        "outputSpeech": {
          "type": "PlainText",
          "text": "Failed to authorize order."
        },
        "shouldEndSession": true
      }
    });

    return;
  }

  code = code.value;

  request({
    uri: `${req.absoluteBaseUrl}/${ApplicationPaths.API}/authorize/${code}`,
    headers: {
      "Authorization": `Bearer ${req.body.session.user.accessToken}`
    },
    method: "POST"
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(`processed order authorization`);

      res.json({
        "version": "1.0",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Order confirmed."
          },
          "shouldEndSession": true
        },
        "sessionAttributes": {

        }
      });
    } else {
      console.log(`failed order authorization (${response.statusCode}|${error})`);
      
      res.json({
        "version": "1.0",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Failed to authorize order."
          },
          "shouldEndSession": true
        }
      });
    }
  });
}