let path = require("path");

// Load the third-party libraries
let express = require("express");
let bodyParser = require("body-parser");

function start(router) {
    // Create a express instance
    let server = express();

    // Static resource path setup
    server.use("/public/", express.static(path.join(__dirname, "./client/public/")));
    server.use("/dist/", express.static(path.join(__dirname, "./client/dist/")));

    // Body parser setup
    server.use(bodyParser.urlencoded({"extended": false}));
    server.use(bodyParser.json());

    // Set views and engines
    server.set("views", path.join(__dirname, "./client/dist/"));
    server.engine("html", require("ejs").renderFile);

    // Load the router
    server.use(router);

    // Configure the listener port
    let port = process.env.PORT || 8001;

    server.listen(port, function () {
        console.log("Server is running at port 8001...");
    });
}

exports.start = start;

