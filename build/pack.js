"use strict";

const fs = require("fs");
const zlib = require("zlib");

const files = {
    "index.html": "./src/client/index.html",
    "scripts.js": "./src/client/scripts.js",
    "styles.css": "./src/client/styles.css",
    "logo.svg": "./src/client/logo.svg"
};

var container = Object.assign({}, files);

var promises = [];

Object.keys(files).forEach(function (fileName) {
    var compress = zlib.createGzip(),
        input = fs.createReadStream(files[fileName]);

    var compressed = input.pipe(compress);

    promises.push(new Promise(function (fullfill, reject) {
        var buffers = [];
        compressed.on('data', function (buffer) {
            buffers.push(buffer);
        });
        compressed.on('end', function () {
            var buffer = Buffer.concat(buffers);

            container[fileName] = buffer.toString("base64");

            fullfill();
        });
    }));
});

Promise.all(promises).then(function () {
    fs.writeFileSync("./src/files.json", JSON.stringify(container));
});


