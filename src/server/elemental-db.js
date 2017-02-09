"use strict";

const fs = require("fs");

function JsonFileElementalDB(filePath, schema, seed) {
  schema = schema || {};
  seed = seed || {};

  var db = seed;

  try {
    db = readFromDisk();

    Object.keys(seed).forEach((key) => db[key] = db[key] || seed[key]);
  } catch (error) {

  }
  finally {
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
      if (error) { return callback(error); }

      var promise = Promise.resolve([]);

      if (!db) {
        db = seed;

        promise = new Promise(function (fulfill, reject) {
          storage.set(db, (error) => {
            if (error) {
              return reject(error);
            }

            fulfill();
          });
        });
      } else if (!upgraded) {
        Object.keys(seed).forEach((key) => db[key] = db[key] || seed[key]);

        upgraded = true;
      }

      promise.then(() => {
        if (!callback && typeof collection === "function") {
          callback = collection;
          collection = null;
        }

        if (collection && db[collection]) {
          callback(null, db[collection]);
        } else {
          callback(null, db);
        }
      }).catch((error) => callback(error));
    });
  };

  this.add = function (data, callback) {
    data = data || {};

    this.get(function (error, db) {
      if (error) { return callback(error); }

      doAdd(db, data, schema);

      storage.set(db, callback);
    });
  };

  this.remove = function (data, callback) {
    data = data || {};

    this.get(function (error, db) {
      if (error) { return callback(error); }

      doRemove(db, data, schema);

      storage.set(db, callback);
    });
  };

  this.update = function (data, callback) {
    data = data || {};

    this.get(function (error, db) {
      if (error) { return callback(error); }

      doUpdate(db, data, schema);

      storage.set(db, callback);
    });
  };

  this.patch = function (data, callback) {
    data = data || {};

    this.get(function (error, db) {
      if (error) { return callback(error); }

      doPatch(db, data, schema);

      storage.set(db, callback);
    });
  };

  this.mutate = function (changes, callback) {
    changes = changes || {};

    this.get(function (error, db) {
      if (error) { return callback(error); }

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
  for (var collection of Object.keys(data)) {
    var type = (schema[collection] && schema[collection].type) || "array";

    switch (type) {
      case "map":
        db[collection] = db[collection] || {};
        data[collection].forEach((element) => db[collection][element.id] = element.value);
        break;

      case "array":
        db[collection] = db[collection] || [];
        data[collection].forEach((element) => db[collection].push(element));
        break;

      case "singleton":
        db[collection] = data[collection];
        break;

      default:
        break;
    }
  }
}

function doRemove(db, data, schema) {
  for (var collection of Object.keys(data)) {
    var type = (schema[collection] && schema[collection].type) || "array";

    switch (type) {
      case "map":
        db[collection] = db[collection] || {};
        data[collection].forEach((element) => delete db[collection][element.id]);
        break;

      case "array":
        db[collection] = db[collection] || [];
        data[collection].forEach((element) => {
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
}

function doUpdate(db, data, schema) {
  for (var collection of Object.keys(data)) {
    var type = (schema[collection] && schema[collection].type) || "array";

    switch (type) {
      case "map":
        db[collection] = db[collection] || {};
        data[collection].forEach((element) => db[collection][element.id] = element.value);
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
}

function doPatch(db, data, schema) {
  for (var collection of Object.keys(data)) {
    var type = (schema[collection] && schema[collection].type) || "array";

    switch (type) {
      case "map":
        db[collection] = db[collection] || {};

        data[collection].forEach((element) => {
          var existing = db[collection][element.id];

          Object.keys(element.value).forEach((key) => existing[key] = element.value[key]);
        });
        break;

      case "array":
        throw new Error("Performing a patch on an array collection is not supported.");
        break;

      case "singleton":
        Object.keys(data[collection]).forEach((key) => db[collection][key] = data[collection][key]);
        break;

      default:
        break;
    }
  }
}

module.exports = {
  JsonFileElementalDB: JsonFileElementalDB,
  WebtaskStorageElementalDB: WebtaskStorageElementalDB
};