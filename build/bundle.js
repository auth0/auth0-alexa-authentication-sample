module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var zlib = __webpack_require__(1);

	var Express = __webpack_require__(2);

	var Webtask = __webpack_require__(3);

	var files = __webpack_require__(4);
	var core = __webpack_require__(5);
	var website = __webpack_require__(11);
	var alexa = __webpack_require__(19);
	var api = __webpack_require__(20);
	var ApplicationPaths = __webpack_require__(18);

	var fileData = {
	  "index.html": zlib.unzipSync(new Buffer(files["index.html"], "base64"), 'utf-8').toString('utf8'),
	  "scripts.js": zlib.unzipSync(new Buffer(files["scripts.js"], "base64"), 'utf-8').toString('utf8'),
	  "styles.css": zlib.unzipSync(new Buffer(files["styles.css"], "base64"), 'utf-8').toString('utf8'),
	  "logo.svg": zlib.unzipSync(new Buffer(files["logo.svg"], "base64"), 'utf-8').toString('utf8')
	};

	var app = new Express();

	app.use("/", core());
	app.use("/" + ApplicationPaths.WEB + "/", website(fileData));
	app.use("/" + ApplicationPaths.ALEXA_SKILL + "/", alexa());
	app.use("/" + ApplicationPaths.API + "/", api());

	module.exports = Webtask.fromExpress(app);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("zlib");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("webtask-tools");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
		"index.html": "H4sIAAAAAAAAC+1XTW8bNxC9F+h/oBdobrtryw5gBKsFAsctAqS2kLiHAAEKajnSUuYuGZKrSDb83zv8kLSS5VROfOihB0nkcOZx5unxqzh6d31x83l0SWrbiPLXX4r461pAGbYIKRqwlFQ11QbsMOnsJD1PSB7GLLcCSiVZkYemtwre3hINYpgYuxRgagCbkFrDZJjU1irzJs8r1ma0s/VxVskm937TjjPIz7LzbPA65y2DRdbwNquMCfNtsANUFsJM8Hg0n10qGCYWFjZfQxR5rAubY8mWhFFLU9VhiE6hpWMBbJjc39+TYMuijTw8PCRbzrew3HLE/mOnSnTGgt5yjDbvHOgyUFkuW1IJaswwmXXNWFot2zCMDvWgLHgzJUZXrmohpzIz86krCQsarN1Owj+Bv9GiSsXv7ihBcAYNbXFQhTnzOOmKVt6qzkbKas4YtAnhSEXFWULmVHQQisB+KDMK4Mk4oyd/W3nr+v1wNG/iPcJRmpI09WjOw0KjBLWQGku1JYlVIsWCOeJgnI9gfL7iqpKthdaumeoNUQEY77/TqZBjKmLnG9Utb5G9econ0S8pC+Mon5afJOq9xnEypozM8L8iNVUKWmBHyFpwIl8w0zDBw0OR46x7EhjbluAnNV1VgRPgPJXtm0rw6naYhJLKD9d/vL/aAGxaW1RAy9bFH0CXkjjH8iC+UDwjzee0WpKRj+rrSZU3NRAVxwMq4YagioFYSRpcZuRtQ+9QXhq+dlxDg+Am26jsJcrpDK4kpeWECzi0qL8whoxCTL+kidTNKsy101pqjvlbVEclRbow6clgBbQ9i3efatmpzbjbj+gYxCYTD3FGXEoaO340KS8bykWR+14/eKuIENoHX68vt6LAYfR3tYQgVRXUUjC3xTh9NZK5XTC69hOPCeH2xI3f0fpp9AT8qPdCDIxq2QK5wq0N9E8SoRzUYURE158noshd8AuKWmrMNa25sVIfvFQLvhrkOJqOO+Z/T0/Pcf/KeUlGmIXbuq4duukLf5VD3PT89CZTwX+/4PesBwfkSFu5hI7/Tid8AWznT7PrW0TfqHcs3pF848zWw+Ts+DdXjK2/5zRwTp/4Hfybo0e7kUphlWaPM5q2s3E+uzkX1l0VDiqDlXgybJOb4YUALG/AnRR2l42ngvy5nRks8QfCbCx4b+i+knfqQ4v7S59YCSsprY8JUp+grEAYcAcGng0UP60kMSkScwynwgFqPotqvpDthOsGb1+H6rlaR7x6RXZtmYB2itIoyfH/gu8bDhY8ko3bYGSb8PYRxcl3ZfqclfC8BfDf0v1GhVvK90F77ocMJrQTdvt+WAmgOikvPly+/Ugurq9+f//xz8t3P3ZTXJ8s7vTEu6yTW4gOz49Kc2XD42L1OpvhlhKfK/g6O80Geey6B9nMOIQQVj4JgQ88RKmE7NhEIDMeic7oIhd8bPJ5B/kgO8nOXes5sHiyZ7OvHeilRwzNdJANsrNnwDR04V6gYykt3umpch0Htza4orNjJGJj2gf/aIIsjpldzyKPavOvUPfO/gcU/dWSfw8AAA==",
		"scripts.js": "H4sIAAAAAAAAC81WS2/UMBC+V+p/sLyVmojdlHMiTrDAoYgKSoVUVZU3md2Eeu3Idnap6P53/Mj7AQtIFbkkGc/MN4/PY3vrgsUq4wx5PvpxeoLQjgiUFzIFgV4hVlAanZ4YebZG3pmHVzx5xH6QEEU87PQWwMiKQoL90gVqOYA9urI/U8YPoEXzyhChmBZSgQjRhH65rm0qC2CxeMwVJCFSogAnPviR+Ti44E1Sl3yTsZsM9h94AlTHVkIq2OaUKAgRnqmcLqjRw6V3Ax2iQZHMI0AVgjX/CBEKQoW2aJXwEJXhlP62oFKeyLAxs3ATEAjtM5bwfUB5TMxqkApY69BxcMGzJL6QigiFoxqtBLOZR03qXySIK8HXGYUjClBo7UXu1Ks6xAKIrfBonAZjt9UeVZrJEtc8ZwH5Rr57rXzUY25w3i2v8byRFoKGJieD3JanQBIQ7WqZB39dvP786e3imj8Aw5Yos1iK9b2yAj/YEer5jcWh5VEWcQxStvMwoH4XYbcNYEsyUyOz6n6inkaecgaVhv2JxjFBCK75HHMmOQXdy03dL79Hj7+lWxvNxKqr2a6jjc7IjqHlBIc+Ct2K95lUXDweQSJu1Bep039eFllo+ew8crBDJjm5Tst9tBIzjxmrbrL1LF094pQwZuvslAJZrGQsshXogciTBUYvXNxZUgXs9xBQ5SRY6WGizYAlGdvgeT/2QQAI3RQQSFBencYcteydVdQ1OvQFXXS9C9aZ2OrT4t/xDfP7aK2SBzVWYIrnTYf7i4DPXd3Dsu65iffedh8SSM7bSehhrApDgN/UYNSlHRLHuTv8D2PGlbi3o8rWDJQRqlsRotu7VvzHn5MxBSImz8mp2TE2Per58WZ5ubxe4k6g00Nkaoz8+SDp9m10mAyHwQirZU6zGLyX89FVCmyj0h51OrjTjOls46lbxRXX8MecBblVxIPWDjwKXiiQjSM8u3C3sbB3e5vX69U9JRy95DR6ZT/D8XOs5c/FGvaz64dK8ry83uoZVbELDHdmeql7fWw2l8kvHF7qiEy79I/5Ni/sSVnbbkCZYHokqfarq9ytYX9gv+/Q01OvaFHdyRJF6O0KnT3lDuglhS0w1XLfkXsWpYzHL71avhx8z7x+AgL2keRVDAAA",
		"styles.css": "H4sIAAAAAAAAC1WMUQrCMBBE/wO5w1wgoRT8aU+zTWKsNpuybkEo3t2oFPRz3rwZf93KVFUq49Jjx0ThlqVuHF2oS5UBKsT3lSSxjnhaY40PlbVF7NYAK8U4cx7QoU9lfCNND3W0zJkHhCYmafgz1fgd/RpLOuvRe6XJ/d0DhSTPzev8KRV0h2rNC2upS4q8AAAA",
		"logo.svg": "H4sIAAAAAAAAC81WbXPiNhD+K6r7IV9kW++yyMtN45C7zqTtzV1Kpx8T4wJzLjDgg6S/vs/KwBDCJdd8KsaybK1293l2tdLZu4e/G7aqF8vJbHqeyEwk7N3F2Q9Xv5W3f37ss+VqxNjH3y9vfi7ZSZrnf+gyz69ur9jnwXsG6Tzv/3rC2Mm4bee9PF+v19laZ7PFKL/9lCshZP6pX6YQTulFBGFodg61UmTDdnhycUYmxvVkNG5hX4r5Q8KW7WNTnyf19O6+qdP7u+rLaDH7Oh32pvWaCVyQo/s0OXB9NanXl7OH82RPKGHrybAd75QDcG85v6tgYL6ol/ViVceP0+V58hwG3Bbk7kak99BMpl+OCcoQQh5Hk4uzEZsMz5OfFu397G4xTPLtl1++Nu2kmjWzBQldnFWTRdXUrILH1iaseuyei+6xoeGvSdP0flT20l/pU9KVj+Lk+V07ZqS00LwQVSoyJ20qM601WheKVGU6mFRnwmj0Q6FunOVer1KbIRoNRpTRnFrJ8KswTSrLY4sJzkr0vfWpgYjq+h+sHWPMSkfiNkguoEdKR/a16kTTKHpjLHc+AzEDr5tUmixYz00mZEHmSlWQl9z7zAnHlSf/ucdH5/EGTE1quB9rhf9NBPnPASnX8RdJ2bHhBTeB2DBKwzeReQMfMynIKyEM+kBNAkJ4GoY19LUhOHBAAB0EPhhIO93xgnFgEVlwlvqOuAjOxT4IXEkwDZ2C0xyyZpTiKhM+EJme+oUKjcMXydG6otqjmu9RzZ9STebHHdsbsvke2XyP7E552ikHKnLU2848Sbhi04+urBAzqysgVaSr8ECB0DmHh4ehGB/4bUGclBxem8Ajs4chuLwunFMxBMcTujAxodVh6PSlE34/n4/M9f575u5C34WMGx8jpinUXhXUt0Sp8TFiNvAY4dJ0uWECJQc3XcYApyGcmwVB6UDESZlSFJVSiDLWkqYoe28QTS8915xYW0VS/0MWRCPflwkD4zcpeRiBsgzBF9sI7MiAHqfGyAVOF6LL9ef4jcf2UEsonTTmaH2xSPZgKBdgqBJUJYShrAkuVXR1i0nF1RZXWHw6LlgESC9Eh1CxpQGsp72+U5E0KXTUGlcXdHdmFc3Xmkj1cQ0SP0EXvBuO/WinhJ8C9cQq8pNvvVYxuk8wHGLXfVzXR7E7zCv8/x+7I+xqi33rdYf9CYbXse/DR9JqFJ6KarwNtIlQibHbO24BETxSu8CTKihEQ0E+ax+3FfKOgKKoG9qcuEWlBxIsNouM10vajjDa7VzQSuuJJpfGZxpalY2F2bhINFaJMRkmwjo5BeOOXjeuYWFZtuEeH8kPiaSAZYnixi2qgMJaGqtioF0WvCo9eIdebbMCIoRYZwXfIH+248hrda326VrUVbs7wIQD8b7qm7493Z1BUMlQ3pxMGKqbdkdXG/D5gcIOpSJN4q30bFj4Fkkv0oOC88Je+3bk1jxH/gY1xh+oidvArHkczaZsPptMWxzmsJkZz9BazcAftYEKO7UezHx7IRxqok3Cs7hVMByYoMmYTfuKpuexdTipqRS7bCpTbEQVzig8dPfAPTvgvFCZOl1QxaGKk6qUzjuhu1/X9eTGCffiX6I3FHIMDAAA"
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var url = __webpack_require__(6);

	var Express = __webpack_require__(2);
	var bodyParser = __webpack_require__(7);
	var cookieParser = __webpack_require__(8);

	var elemental = __webpack_require__(9);

	module.exports = function () {
	  var router = Express.Router();

	  router.use("/", function (req, res, next) {
	    // Ensure that database is available at the request level
	    var schema = {
	      config: { type: "singleton" },
	      sessions: { type: "map" },
	      orders: { type: "map" },
	      pending_orders: { type: "map" }
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

	    req.absoluteUrl = [xfproto ? xfproto.split(',')[0].trim() : 'https', '://', req.get('Host'),
	    //xfport ? ':' + xfport.split(',')[0].trim() : '',
	    url.parse(req.originalUrl).pathname].join('');

	    req.absoluteBaseUrl = [xfproto ? xfproto.split(',')[0].trim() : 'https', '://', req.get('Host'),
	    //xfport ? ':' + xfport.split(',')[0].trim() : '',
	    req.basePath].join('');

	    // Make the global configuration available at the request level
	    req.db.get(function (error, data) {
	      if (error) {
	        return next(error);
	      }

	      req.config = data.config;

	      next();
	    });
	  });

	  return router;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var fs = __webpack_require__(10);

	function JsonFileElementalDB(filePath, schema, seed) {
	  schema = schema || {};
	  seed = seed || {};

	  var db = seed;

	  try {
	    db = readFromDisk();

	    Object.keys(seed).forEach(function (key) {
	      return db[key] = db[key] || seed[key];
	    });
	  } catch (error) {} finally {
	    writeToDisk(db);
	  }

	  this.get = function (collection, callback) {
	    var db = readFromDisk();

	    if (!callback && typeof collection === "function") {
	      callback = collection;
	      collection = null;
	    }

	    if (collection && db[collection]) {
	      callback(null, db[collection]);
	    } else {
	      callback(null, db);
	    }
	  };

	  this.add = function (data, callback) {
	    data = data || {};

	    var db = readFromDisk();

	    doAdd(db, data, schema);

	    writeToDisk(db);

	    callback();
	  };

	  this.remove = function (data, callback) {
	    data = data || {};

	    var db = readFromDisk();

	    doRemove(db, data, schema);

	    writeToDisk(db);

	    callback();
	  };

	  this.update = function (data, callback) {
	    data = data || {};

	    var db = readFromDisk();

	    doUpdate(db, data, schema);

	    writeToDisk(db);

	    callback();
	  };

	  this.patch = function (data, callback) {
	    data = data || {};

	    var db = readFromDisk();

	    doPatch(db, data, schema);

	    writeToDisk(db);

	    callback();
	  };

	  this.mutate = function (changes, callback) {
	    changes = changes || {};

	    var db = readFromDisk();

	    if (changes.update) {
	      doUpdate(db, changes.update, schema);
	    }

	    if (changes.patch) {
	      doPatch(db, changes.patch, schema);
	    }

	    if (changes.remove) {
	      doRemove(db, changes.remove, schema);
	    }

	    if (changes.add) {
	      doAdd(db, changes.add, schema);
	    }

	    writeToDisk(db);

	    callback();
	  };

	  function readFromDisk() {
	    return JSON.parse(fs.readFileSync(filePath));
	  }

	  function writeToDisk(db) {
	    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
	  }
	}

	function WebtaskStorageElementalDB(storage, schema, seed) {
	  schema = schema || {};
	  seed = seed || {};

	  var upgraded = false;

	  this.get = function (collection, callback) {
	    storage.get(function (error, db) {
	      if (error) {
	        return callback(error);
	      }

	      var promise = Promise.resolve([]);

	      if (!db) {
	        db = seed;

	        promise = new Promise(function (fulfill, reject) {
	          storage.set(db, function (error) {
	            if (error) {
	              return reject(error);
	            }

	            fulfill();
	          });
	        });
	      } else if (!upgraded) {
	        Object.keys(seed).forEach(function (key) {
	          return db[key] = db[key] || seed[key];
	        });

	        upgraded = true;
	      }

	      promise.then(function () {
	        if (!callback && typeof collection === "function") {
	          callback = collection;
	          collection = null;
	        }

	        if (collection && db[collection]) {
	          callback(null, db[collection]);
	        } else {
	          callback(null, db);
	        }
	      }).catch(function (error) {
	        return callback(error);
	      });
	    });
	  };

	  this.add = function (data, callback) {
	    data = data || {};

	    this.get(function (error, db) {
	      if (error) {
	        return callback(error);
	      }

	      doAdd(db, data, schema);

	      storage.set(db, callback);
	    });
	  };

	  this.remove = function (data, callback) {
	    data = data || {};

	    this.get(function (error, db) {
	      if (error) {
	        return callback(error);
	      }

	      doRemove(db, data, schema);

	      storage.set(db, callback);
	    });
	  };

	  this.update = function (data, callback) {
	    data = data || {};

	    this.get(function (error, db) {
	      if (error) {
	        return callback(error);
	      }

	      doUpdate(db, data, schema);

	      storage.set(db, callback);
	    });
	  };

	  this.patch = function (data, callback) {
	    data = data || {};

	    this.get(function (error, db) {
	      if (error) {
	        return callback(error);
	      }

	      doPatch(db, data, schema);

	      storage.set(db, callback);
	    });
	  };

	  this.mutate = function (changes, callback) {
	    changes = changes || {};

	    this.get(function (error, db) {
	      if (error) {
	        return callback(error);
	      }

	      if (changes.update) {
	        doUpdate(db, changes.update, schema);
	      }

	      if (changes.patch) {
	        doPatch(db, changes.patch, schema);
	      }

	      if (changes.remove) {
	        doRemove(db, changes.remove, schema);
	      }

	      if (changes.add) {
	        doAdd(db, changes.add, schema);
	      }

	      storage.set(db, callback);
	    });
	  };
	}

	function doAdd(db, data, schema) {
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = Object.keys(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var collection = _step.value;

	      var type = schema[collection] && schema[collection].type || "array";

	      switch (type) {
	        case "map":
	          db[collection] = db[collection] || {};
	          data[collection].forEach(function (element) {
	            return db[collection][element.id] = element.value;
	          });
	          break;

	        case "array":
	          db[collection] = db[collection] || [];
	          data[collection].forEach(function (element) {
	            return db[collection].push(element);
	          });
	          break;

	        case "singleton":
	          db[collection] = data[collection];
	          break;

	        default:
	          break;
	      }
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }
	}

	function doRemove(db, data, schema) {
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var collection = _step2.value;

	      var type = schema[collection] && schema[collection].type || "array";

	      switch (type) {
	        case "map":
	          db[collection] = db[collection] || {};
	          data[collection].forEach(function (element) {
	            return delete db[collection][element.id];
	          });
	          break;

	        case "array":
	          db[collection] = db[collection] || [];
	          data[collection].forEach(function (element) {
	            var index = db[collection].indexOf(element);

	            if (index > -1) {
	              db[collection].splice(index, 1);
	            }
	          });
	          break;

	        case "singleton":
	          delete db[collection];
	          break;

	        default:
	          break;
	      }
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }
	}

	function doUpdate(db, data, schema) {
	  var _iteratorNormalCompletion3 = true;
	  var _didIteratorError3 = false;
	  var _iteratorError3 = undefined;

	  try {
	    for (var _iterator3 = Object.keys(data)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	      var collection = _step3.value;

	      var type = schema[collection] && schema[collection].type || "array";

	      switch (type) {
	        case "map":
	          db[collection] = db[collection] || {};
	          data[collection].forEach(function (element) {
	            return db[collection][element.id] = element.value;
	          });
	          break;

	        case "array":
	          throw new Error("Performing an update on an array collection is not supported.");
	          break;

	        case "singleton":
	          db[collection] = data[collection];
	          break;

	        default:
	          break;
	      }
	    }
	  } catch (err) {
	    _didIteratorError3 = true;
	    _iteratorError3 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion3 && _iterator3.return) {
	        _iterator3.return();
	      }
	    } finally {
	      if (_didIteratorError3) {
	        throw _iteratorError3;
	      }
	    }
	  }
	}

	function doPatch(db, data, schema) {
	  var _iteratorNormalCompletion4 = true;
	  var _didIteratorError4 = false;
	  var _iteratorError4 = undefined;

	  try {
	    for (var _iterator4 = Object.keys(data)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	      var collection = _step4.value;

	      var type = schema[collection] && schema[collection].type || "array";

	      switch (type) {
	        case "map":
	          db[collection] = db[collection] || {};

	          data[collection].forEach(function (element) {
	            var existing = db[collection][element.id];

	            Object.keys(element.value).forEach(function (key) {
	              return existing[key] = element.value[key];
	            });
	          });
	          break;

	        case "array":
	          throw new Error("Performing a patch on an array collection is not supported.");
	          break;

	        case "singleton":
	          Object.keys(data[collection]).forEach(function (key) {
	            return db[collection][key] = data[collection][key];
	          });
	          break;

	        default:
	          break;
	      }
	    }
	  } catch (err) {
	    _didIteratorError4 = true;
	    _iteratorError4 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion4 && _iterator4.return) {
	        _iterator4.return();
	      }
	    } finally {
	      if (_didIteratorError4) {
	        throw _iteratorError4;
	      }
	    }
	  }
	}

	module.exports = {
	  JsonFileElementalDB: JsonFileElementalDB,
	  WebtaskStorageElementalDB: WebtaskStorageElementalDB
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var url = __webpack_require__(6);
	var crypto = __webpack_require__(12);

	var _ = __webpack_require__(13);
	var Handlebars = __webpack_require__(14);
	var request = __webpack_require__(15);
	var base64url = __webpack_require__(16);
	var Express = __webpack_require__(2);
	var bodyParser = __webpack_require__(7);
	var cookieParser = __webpack_require__(8);

	var jwt = __webpack_require__(17);

	var ApplicationPaths = __webpack_require__(18);

	Handlebars.registerHelper("template-start", function (id) {
	  return new Handlebars.SafeString("<script type=\"text/x-template\" id=\"" + id + "\">");
	});

	Handlebars.registerHelper("template-end", function () {
	  return new Handlebars.SafeString('</script>');
	});

	module.exports = function (files) {
	  var app = new Express();

	  app.use(cookieParser());
	  app.use(bodyParser.urlencoded({ extended: true }));

	  app.get("/debug", function (req, res) {
	    return res.json({});
	  });

	  app.get("/ping", function (req, res) {
	    return res.send("PONG");
	  });

	  // Process the application root
	  app.get("/", session, function (req, res) {
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
	  app.get("/scripts.js", function (req, res) {
	    res.setHeader('Content-Type', 'text/javascript');
	    res.send(files["scripts.js"]);
	  });
	  app.get("/styles.css", function (req, res) {
	    res.setHeader('Content-Type', 'text/css');
	    res.send(files["styles.css"]);
	  });
	  app.get("/logo.svg", function (req, res) {
	    res.setHeader('Content-Type', 'image/svg+xml');
	    res.send(files["logo.svg"]);
	  });

	  // Back-end routes
	  app.get("/user", session, function (req, res) {
	    if (req.session) {
	      res.json({ "email": req.session.email, "phone": req.session.phoneNumber });
	    } else {
	      res.sendStatus(403);
	    }
	  });

	  app.get("/orders", session, function (req, res) {
	    if (req.session) {
	      req.db.get(function (error, data) {
	        if (error) {
	          return next(error);
	        }

	        var orders = {
	          "pending": data.pending_orders[req.session.userId],
	          "confirmed": data.orders[req.session.userId]
	        };

	        res.json(orders);
	      });
	    } else {
	      res.sendStatus(403);
	    }
	  });

	  app.delete("/orders", session, function (req, res) {
	    if (req.session) {
	      req.db.update({ orders: [{ id: req.session.userId, value: [] }] }, function (error) {
	        if (error) {
	          return next(error);
	        }

	        res.sendStatus(200);
	      });
	    } else {
	      res.sendStatus(403);
	    }
	  });

	  // Handle authentication
	  app.get("/oidc/start", function (req, res) {
	    var domain = req.webtaskContext.data.AUTH0_DOMAIN;
	    var clientId = req.webtaskContext.data.APP_CLIENT_ID;
	    var redirectUri = req.absoluteBaseUrl + "/" + ApplicationPaths.WEB + "/oidc/callback";

	    var state = base64url.escape(crypto.randomBytes(16).toString("base64"));

	    res.cookie("state", state, { httpOnly: true, secure: true, path: req.basePath });

	    // TODO : Encode redirect URI

	    res.redirect("https://" + domain + "/authorize?response_type=code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&state=" + state + "&scope=openid%20email%20phone");
	  });

	  app.get("/oidc/callback", function (req, res) {
	    var code = req.query.code,
	        state = req.query.state;

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
	      uri: "https://" + req.webtaskContext.data.AUTH0_DOMAIN + "/oauth/token",
	      json: {
	        "grant_type": "authorization_code",
	        "code": code,
	        "client_id": req.webtaskContext.data.APP_CLIENT_ID,
	        "client_secret": req.webtaskContext.data.APP_CLIENT_SECRET,
	        "redirect_uri": req.absoluteBaseUrl + "/" + ApplicationPaths.WEB + "/oidc/callback"
	      },
	      method: "POST"
	    }, function (error, response, body) {
	      if (!error && response.statusCode == 200) {
	        (function () {
	          var idToken = response.body.id_token;

	          var claims = jwt.decode(idToken);

	          var session = {
	            csrf: base64url.escape(crypto.randomBytes(16).toString("base64")),
	            userId: claims.sub,
	            email: claims.email,
	            phoneNumber: claims.phone_number
	          };

	          var sid = base64url.escape(crypto.randomBytes(32).toString("base64"));

	          req.db.add({ sessions: [{ id: sid, value: session }] }, function (error) {
	            if (error) {
	              return next(error);
	            }

	            res.cookie("sid", sid, { httpOnly: true, secure: true, path: req.basePath });

	            res.redirect(req.absoluteBaseUrl + "/" + ApplicationPaths.WEB + "/#/orders");
	          });
	        })();
	      } else {
	        console.log("failed token request(" + error + ") with status code (" + response.statusCode + ")");

	        res.sendStatus(400);
	      }
	    });
	  });

	  app.use(function (error, req, res, next) {
	    console.log(error);
	    res.sendStatus(500);
	  });

	  return app;
	};

	function session(req, res, next) {
	  req.db.get(function (error, data) {
	    if (error) {
	      return next(error);
	    }

	    req.session = data.sessions[req.cookies.sid];

	    next();
	  });
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("handlebars");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("base64-url");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  "WEB": "app",
	  "API": "api",
	  "ALEXA_SKILL": "alexa"
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Express = __webpack_require__(2);
	var bodyParser = __webpack_require__(7);
	var request = __webpack_require__(15);

	var ApplicationPaths = __webpack_require__(18);

	module.exports = function () {
	  var router = Express.Router();

	  router.use(bodyParser.json());

	  router.post("/", function (req, res, next) {
	    // TODO : Verify ID

	    // TODO : Ensure access token

	    var type = req.body && req.body.request && req.body.request.type;

	    switch (type) {
	      case "LaunchRequest":
	        handleLaunchRequest(req, res, next);
	        break;

	      case "IntentRequest":
	        var intent = req.body.request.intent && req.body.request.intent.name;

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
	};

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
	    "sessionAttributes": {}
	  });
	}

	function handleSessionEndedRequest(req, res, next) {
	  res.sendStatus(200);
	}

	function handleGetMeSomePizzaIntentRequest(req, res, next) {
	  var size = req.body.request.intent.slots && req.body.request.intent.slots["Size"];

	  if (size && size.value) {
	    size = size.value;
	  } else {
	    size = "medium";
	  }

	  var toppings = req.body.request.intent.slots && req.body.request.intent.slots["Toppings"];

	  if (toppings && toppings.value) {
	    toppings = toppings.value;
	  } else {
	    toppings = "ham bacon and pineapple";
	  }

	  var pizza = { "size": size, "toppings": toppings };

	  console.log("initiating request to (" + req.absoluteBaseUrl + "/" + ApplicationPaths.API + "/orders)");

	  request({
	    uri: req.absoluteBaseUrl + "/" + ApplicationPaths.API + "/orders",
	    headers: {
	      "Authorization": "Bearer " + req.body.session.user.accessToken
	    },
	    json: pizza,
	    method: "POST"
	  }, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      console.log("processed order request");

	      var transport = void 0;

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
	            "text": "I have received your pizza request. Authorize the transaction using the code received " + transport + "."
	          },
	          "reprompt": {
	            "outputSpeech": {
	              "type": "PlainText",
	              "text": "If you still haven't received the code " + transport + " you can later authorize this request by saying operation pizza is a go and then the code."
	            }
	          },
	          "shouldEndSession": false
	        },
	        "sessionAttributes": {}
	      });
	    } else {
	      console.log("failed order request (" + response.statusCode + "|" + error + ")");

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
	  var code = req.body.request.intent.slots && req.body.request.intent.slots["Code"];

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
	    uri: req.absoluteBaseUrl + "/" + ApplicationPaths.API + "/authorize/" + code,
	    headers: {
	      "Authorization": "Bearer " + req.body.session.user.accessToken
	    },
	    method: "POST"
	  }, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      console.log("processed order authorization");

	      res.json({
	        "version": "1.0",
	        "response": {
	          "outputSpeech": {
	            "type": "PlainText",
	            "text": "Order confirmed."
	          },
	          "shouldEndSession": true
	        },
	        "sessionAttributes": {}
	      });
	    } else {
	      console.log("failed order authorization (" + response.statusCode + "|" + error + ")");

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

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var crypto = __webpack_require__(12);

	var _ = __webpack_require__(13);
	var Express = __webpack_require__(2);
	var bodyParser = __webpack_require__(7);
	var request = __webpack_require__(15);
	var Pusher = __webpack_require__(21);

	var expressJwt = __webpack_require__(22);

	var jwt = __webpack_require__(17);
	var auth0 = process.env["NON_WEBTASK_RUNTIME"] === "1" ? __webpack_require__(23) : __webpack_require__(24);

	var pusher = null;

	module.exports = function () {
	  var router = Express.Router();

	  router.use(bodyParser.json());

	  router.use(function (req, res, next) {
	    var check = expressJwt({
	      issuer: "https://" + req.webtaskContext.data.AUTH0_DOMAIN + "/",
	      audience: req.webtaskContext.data.API_ID,
	      secret: req.webtaskContext.data.API_SIGNING_KEY
	    });

	    console.log("received api request (" + req.url + ")");
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

	  router.use(tokenify, function (req, res, next) {
	    var management = new auth0.ManagementClient({
	      domain: req.webtaskContext.data.AUTH0_DOMAIN,
	      token: req.token
	    });

	    management.users.get({ "id": req.user.sub, "fields": "email,phone_number,identities,user_metadata" }).then(function (user) {
	      req.user.email = user.email;
	      req.user.phone = user.phone_number || user.user_metadata && user.user_metadata.phone_number;

	      var promise = Promise.resolve(1);

	      // Ensure passwordless provisioning
	      if (req.user.phone) {
	        var passwordless = _.find(user.identities, { "provider": "sms" });

	        if (!passwordless) {
	          console.log("provisioning SMS passwordless user for (" + JSON.stringify(req.user) + ")");

	          // Create passwordless SMS user
	          var _user = { "connection": "sms", "phone_number": req.user.phone };

	          promise = management.users.create(_user).then(function (user) {
	            return management.users.link(req.user.sub, { "provider": "sms", "user_id": user.user_id });
	          });
	        }
	      } else {
	        var _passwordless = _.find(user.identities, { "provider": "email" });

	        if (!_passwordless) {
	          console.log("provisioning email passwordless user for (" + JSON.stringify(req.user) + ")");

	          // Create passwordless email user
	          var _user2 = { "connection": "email", "email": req.user.email };

	          promise = management.users.create(_user2).then(function (user) {
	            return management.users.link(req.user.sub, { "provider": "email", "user_id": user.user_id });
	          });
	        }
	      }

	      return promise.then(function () {
	        console.log("updated user (" + JSON.stringify(req.user) + ")");

	        next();
	      });
	    }).catch(next);
	  });

	  router.post("/orders", function (req, res, next) {
	    var order = {
	      "pizza": req.body,
	      "state": "pending",
	      "datetime": new Date().toISOString()
	    };

	    console.log("received order: " + JSON.stringify(order));

	    // Save order to DB
	    req.db.add({ pending_orders: [{ id: req.user.sub, value: order }] }, function (error) {
	      if (error) {
	        return next(error);
	      }

	      var cid = crypto.createHash("sha1").update(req.user.sub).digest("hex");

	      if (pusher) {
	        pusher.trigger("pod-" + cid, "pending", order);
	      }

	      var payload = {
	        "send": "code",
	        "client_id": req.webtaskContext.data.APP_CLIENT_ID
	      };

	      var mode = void 0;

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
	        uri: "https://" + req.webtaskContext.data.AUTH0_DOMAIN + "/passwordless/start",
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

	  router.post("/authorize/:code", function (req, res, next) {
	    var code = req.params.code;

	    if (!code) {
	      console.log("failed to receive authorization code");

	      res.sendStatus(400);

	      return;
	    }

	    // Get order from DB
	    req.db.get(function (error, data) {
	      if (error) {
	        return next(error);
	      }

	      var order = data.pending_orders[req.user.sub];

	      if (!order) {
	        console.log("failed to find order associated with user (" + req.user.sub + ")");

	        res.sendStatus(400);

	        return;
	      }

	      var payload = {
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
	        uri: "https://" + req.webtaskContext.data.AUTH0_DOMAIN + "/oauth/ro",
	        json: payload,
	        method: "POST"
	      }, function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	          // Validate ID Token subject
	          var token = jwt.decode(response.body.id_token);

	          if (!token || token.sub !== req.user.sub) {
	            console.log("mismatch between token user (" + token.sub + ") and order user (" + req.user.sub + ")");

	            res.sendStatus(400);

	            return;
	          }

	          order.state = "confirmed";

	          var confirmed = data.orders[req.user.sub] || [];

	          confirmed.push(order);

	          var changes = {
	            remove: { pending_orders: [{ id: req.user.sub }] },
	            update: { orders: [{ id: req.user.sub, value: confirmed }] }
	          };

	          // Update order in DB
	          req.db.mutate(changes, function (error) {
	            if (error) {
	              return next(error);
	            }

	            var cid = crypto.createHash("sha1").update(req.user.sub).digest("hex");

	            if (pusher) {
	              pusher.trigger("pod-" + cid, "confirmed", order);
	            }

	            res.sendStatus(200);
	          });
	        } else {
	          console.log("failed to validate the authorization code");

	          res.sendStatus(400);
	        }
	      });
	    });
	  });

	  return router;
	};

	function tokenify(req, res, next) {
	  var domain = req.webtaskContext.data.AUTH0_DOMAIN;

	  request({
	    uri: "https://" + domain + "/oauth/token",
	    json: {
	      audience: "https://" + domain + "/api/v2/",
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

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("pusher");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("express-jwt");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("auth0");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("auth0@2.1.0");

/***/ }
/******/ ]);