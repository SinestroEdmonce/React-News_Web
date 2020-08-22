// Load third-party libraries
let express = require("express");

let guardian = require("./routes/guardian");
let nytimes = require("./routes/nytimes");

// Global constant
const GUARDIAN_API_KEY = "a630fd28-8faa-4630-a131-60d6bdb70953";
const NYTIMES_API_KEY = "ldD8gvzKAfxuAHwubdtb1vWL0X9uEWxp";

// Create a router instance
let router = express.Router();

// Main route for the index.html
router.get("/", function (request, response) {
    // Debug
    console.log("GET: /");
    
    response.render("index.html");
});

// Load the news api router to the Router middleware
guardian(GUARDIAN_API_KEY, router);
nytimes(NYTIMES_API_KEY, router);

module.exports = router;