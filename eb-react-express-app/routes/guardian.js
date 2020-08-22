// Load third-party libraries
let express = require("express");
let request = require("request");

// Max amount of news to show
const G_MAX_NUM_SHOWN = 10;
// Default image for guardian news
const G_DEFAULT_IMAGE = "/public/images/guardian-logo.png";
// Section and home api url for guardian
const G_SECTION_API_URL = "https://content.guardianapis.com/search?api-key={}&section={}&show-blocks=all&page-size=20";
const G_HOME_PARAM = "(politics|business|technology|sport)";
// Sections that do not belong to "any other"
const G_SECTIONS_LIST = ["world", "politics", "business", "technology", "sports"];
// Search api url for guardian
const G_SEARCH_API_URL = "https://content.guardianapis.com/search?q={}&api-key={}&show-blocks=all&page-size=20";
// Article details api url for guardian
const G_ARTICLE_API_URL = "https://content.guardianapis.com/{}?api-key={}&show-blocks=all";

/**
 * Function that is used to load the routers for guardian to the parent router
 * @param {String} apikey
 * @param {express.Router} router 
 */
function guardian(apikey, router) {

    // Get the section content for guardian news
    router.get("/G/:section", function (request, response) {
        // Debug
        console.log("GET: /G/:section");

        // Parse the url params
        let section = request.params.section;
        if (section === "home") {
            section = G_HOME_PARAM;
        }
        else if (section === "sports") {
            section = "sport";
        }
        
        // Combine all params to form the api url
        const API_URL = G_SECTION_API_URL.format(apikey, section);
        getNews(API_URL, function (error, status, data) {
            if (error || status !== 200) {
                return response.status(500).send("Server Internal Error.")
            }

            response.status(200).send(JSON.stringify(data));
        }, "section");
    });
    
    router.get("/G/search/:keyword", function (request, response) {
        // Debug
        console.log("GET: /G/search/:keyword");

        // Parse the url params
        let keyword = request.params.keyword;

        // Combine all params to form the api url
        const API_URL = G_SEARCH_API_URL.format(keyword, apikey);
        getNews(API_URL, function (error, status, data) {
            if (error || status !== 200) {
                return response.status(500).send("Server Internal Error.")
            }

            response.status(200).send(JSON.stringify(data));
        }, "search");
    });

    router.get("/G/details/article", function (request, response) {
        // Debug
        console.log("GET: /G/details/artilce?id={}");

        // Parse the url params
        let articleId = request.query.id;

        // Combine all the params to form the api url
        const API_URL = G_ARTICLE_API_URL.format(articleId, apikey);
        getArticle(API_URL, function (error, status, data) {
            if (error || status != 200) {
                return response.status(500).send("Server Internal Error.");
            }

            response.status(200).send(JSON.stringify(data));
        })
    });

    /**
     * Function that is used to get the section news from the guardian news, using the API
     * @param {*} url 
     * @param {*} callback 
     */
    function getArticle(url, callback) {
        request(url, function(error, response, body) {
            // Http request error 
            if (error) {
                return callback(error, null, null);
            }

            // Pre-process the data
            let rawData = JSON.parse(body).response.content;
            let cleanData = validation(rawData);
            delete cleanData.isValid;
            
            // Check the section id
            if (cleanData.sectionId == "sport") {
                cleanData.sectionId = "sports";
                cleanData.sectionCSSType = "sports";
            }
            // If the sectionId does not belong to the section list
            if (G_SECTIONS_LIST.indexOf(cleanData.sectionId) < 0) {
                cleanData.sectionCSSType = "anyother";
            }

            // Deal with the time format
            cleanData.publishedAt = cleanData.publishedAt.split("T")[0];
            callback(null, response.statusCode, {
                "status": "ok", 
                "result": cleanData
            });
        })
    }

    /**
     * Function that is used to get the section news from the guardian news, using the API
     * @param {*} url 
     * @param {*} callback 
     * @param {String} forWhat
     */
    function getNews(url, callback, forWhat) {
        request(url, function(error, response, body) {
            // Http request error 
           if (error) {
               return callback(error, null, null);
           }

           // Pre-process the data
           let rawData = JSON.parse(body).response.results;
           let cleanData = [];
           rawData.forEach(function (item, index) {
                let news = validation(item);
                if (news.isValid) {
                    // Remove the redundant key
                    delete news.isValid;
                    
                    if (news.sectionId == "sport") {
                        news.sectionId = "sports";
                        news.sectionCSSType = "sports";
                    }
                    // If the sectionId does not belong to the section list
                    if (G_SECTIONS_LIST.indexOf(news.sectionId) < 0) {
                        news.sectionCSSType = "anyother";
                    }

                    // Format the time 
                    news.publishedAt = news.publishedAt.split("T")[0];
                    cleanData.push(news);
                }
           });
           callback(null, response.statusCode, {
               "status": "ok", 
               "results": cleanData.slice(0, G_MAX_NUM_SHOWN)
            });
        })
    }

    /**
     * Function that is used to validate the artilce
     * @param {*} article
     */
    function validation(article) {

        function check(item) {
            return (item === null || item === "" || item === NaN);
        }

        // Pre-store the values
        let assets = (article.blocks.main? (
                article.blocks.main.elements["0"].assets? 
                    article.blocks.main.elements["0"].assets: []
            ): []
        );

        let ret = {
            "isValid": true,
            "title": article.webTitle,
            "imageURL": ((assets.length === 0)? G_DEFAULT_IMAGE: assets[assets.length-1].file),
            "sectionId": article.sectionId,
            "sectionCSSType": article.sectionId,
            "articleId": article.id,
            "publishedAt": article.webPublicationDate,
            "description": article.blocks.body["0"].bodyTextSummary,
            "url": article.webUrl,
            "source": "guardian"
        };

        // Validate the values
        Object.keys(ret).forEach(function (key) {
            if (key !== "isValid" && check(ret[key])) {
                // If the image url is invalid, replace it
                if (key === "imageURL") {
                    ret[key] = G_DEFAULT_IMAGE;
                }
                // Otherwise, the article is invalid
                else {
                    ret.isValid = false;
                }
            }
        });

        return ret;
    }

}

module.exports = guardian;
