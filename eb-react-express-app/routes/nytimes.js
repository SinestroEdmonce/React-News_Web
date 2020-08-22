// Load third-party libraries
let express = require("express");
let request = require("request");

// Max amount of news to show
const NY_MAX_NUM_SHOWN = 10;
// Default image for nytimes news
const NY_DEFAULT_IMAGE = "/public/images/nytimes-logo.jpg";
// Section and home api url for nytimes
const NY_HOME_API_URL = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key={}";
const NY_SECTION_API_URL = "https://api.nytimes.com/svc/topstories/v2/{}.json?api-key={}";
// Sections that do not belong to "any other"
const NY_SECTIONS_LIST = ["world", "politics", "business", "technology", "sports"];
// Search api url for nytimes news
const NY_SEARCH_API_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q={}&api-key={}";
// Article details api url for nytimes news
const NY_ARTICLE_API_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(\"{}\")&api-key={}";
// Minimum width of the image
const NY_IMAGE_MIN_WIDTH = 2000;

/**
 * Function that is used to load the routers for nytimes to the parent router
 * @param {String} apikey
 * @param {express.Router} router 
 */
function nytimes(apikey, router) {

    // Get the section content for guardian news
    router.get("/NY/:section", function (request, response) {
        // Debug
        console.log("GET: /NY/:section");

        // Parse the url params
        let section = request.params.section;
        // Combine all params to form the api url
        let API_URL = "";
        if (section === "home") {
            API_URL = NY_HOME_API_URL.format(apikey);
        }
        else {
            API_URL = NY_SECTION_API_URL.format(section, apikey);
        }

        getSectionNews(API_URL, function (error, status, data) {
            if (error || status !== 200) {
                return response.status(500).send("Server Internal Error.")
            }

            response.status(200).send(JSON.stringify(data));
        });
    });

    router.get("/NY/search/:keyword", function (request, response) {
        // Debug
        console.log("GET: /NY/search/:keyword");

        // Parse the url params
        let keyword = request.params.keyword;
        const API_URL = NY_SEARCH_API_URL.format(keyword, apikey);
        
        // Get the search results
        getSearchResults(API_URL, function (error, status, data) {
            if (error || status !== 200) {
                return response.status(500).send("Server Internal Error.")
            }

            response.status(200).send(JSON.stringify(data));
        });
    });
    
    router.get("/NY/details/article", function (request, response) {
        // Debug
        console.log("GET: /NY/details/article?id={}");

        // Parse the url params
        let articleId = request.query.id;
        const API_URL = NY_ARTICLE_API_URL.format(articleId, apikey);
        
        // Get the article details
        getArticleDetails(API_URL, function (error, status, data) {
            if (error || status !== 200) {
                return response.status(500).send("Server Internal Error.")
            }

            response.status(200).send(JSON.stringify(data));
        })
    })

    /**
     * Function that is used to get the article details
     * @param {*} url 
     * @param {*} callback 
     */
    function getArticleDetails(url, callback) {

        request(url, function (error, response, body) {
             // Http request error 
            if (error) {
                return callback(error, null, null);
            }

            // Pre-process the data
            let rawData = JSON.parse(body).response.docs[0];
            let cleanData = validateArticleDetails(rawData);

            delete cleanData.isValid;
            // If the main section is not in the list
            if (NY_SECTIONS_LIST.indexOf(cleanData.sectionId) < 0) {
                cleanData.sectionCSSType = "anyother";
            }

            // Format the time 
            cleanData.publishedAt = cleanData.publishedAt.split("T")[0];
            callback(null, response.statusCode, {
                "status": "ok", 
                "result": cleanData
            });
        })
    }
    
    /**
     * Function that is used to validate the article details
     * @param {*} article 
     */
    function validateArticleDetails(article) {
        function check(item) {
            return (
                item === null || item === "" || item === undefined || item === NaN
            );
        }

        // Find out the valid image if there exists one
        let validImageURL = NY_DEFAULT_IMAGE;
        // Ensure that the artilce has the "multimedia" element
        article.multimedia && Array.from(article.multimedia).some(function (item, index) {
            if (item.width >= NY_IMAGE_MIN_WIDTH && validImageURL === NY_DEFAULT_IMAGE) {
                validImageURL = "http://www.nytimes.com/"+item.url;
                return true;
            } 
        });

        let sectionId = (check(article.news_desk)? "none": article.news_desk.toLowerCase());

        let ret = {
            "isValid": true,
            "title": article.headline.main,
            "sectionId": sectionId,
            "sectionCSSType": sectionId,
            "imageURL": validImageURL,
            "articleId": article.web_url,
            "publishedAt": article.pub_date,
            "description": article.abstract,
            "url": article.web_url,
            "source": "nytimes"
        }

        // Validate the values
        Object.keys(ret).forEach(function (key) {
            if (key !== "isValid" && check(ret[key])) {
                // The article is invalid
                ret.isValid = false;
            }
        });

        return ret;
    }

    /**
     * Function that is used to get the search results from the nytimes news, using the API
     * @param {*} url 
     * @param {*} callback 
     */
    function getSearchResults(url, callback) {
        request(url, function (error, response, body) {
            // Http request error 
           if (error) {
               return callback(error, null, null);
           }

           // Pre-process the data
           let rawData = JSON.parse(body).response.docs;
           let cleanData = [];
           rawData.forEach(function (item, index) {
                let news = validateSearchResults(item);
                if (news.isValid) {
                    // Remove the redundant key
                    delete news.isValid;
                    // If the main section is not in the list
                    if (NY_SECTIONS_LIST.indexOf(news.sectionId) < 0) {
                        news.sectionCSSType = "anyother";
                    }
                    // Format the time 
                    news.publishedAt = news.publishedAt.split("T")[0];
                    cleanData.push(news);
                }
           });
           callback(null, response.statusCode, {
               "status": "ok", 
               "results": cleanData
            });
        })
    }

    /**
     * Function that is used to validate the search results
     * @param {*} article 
     */
    function validateSearchResults(article) {

        function check(item) {
            return (
                item === null || item === "" || item === undefined || item === NaN
            );
        }

        // Find out the valid image if there exists one
        let validImageURL = NY_DEFAULT_IMAGE;
        // Ensure that the artilce has the "multimedia" element
        article.multimedia && Array.from(article.multimedia).some(function (item, index) {
            if (item.width >= NY_IMAGE_MIN_WIDTH && validImageURL === NY_DEFAULT_IMAGE) {
                validImageURL = "http://www.nytimes.com/"+item.url;
                return true;
            } 
        });

        let sectionId = (check(article.news_desk)? "none": article.news_desk.toLowerCase());

        let ret = {
            "isValid": true,
            "title": article.headline.main,
            "sectionId": sectionId,
            "sectionCSSType": sectionId,
            "imageURL": validImageURL,
            "articleId": article.web_url,
            "publishedAt": article.pub_date,
            "description": article.abstract,
            "url": article.web_url,
            "source": "nytimes"
        }

        // Validate the values
        Object.keys(ret).forEach(function (key) {
            if (key !== "isValid" && check(ret[key])) {
                // The article is invalid
                ret.isValid = false;
            }
        });

        return ret;
    }

    /**
     * Function that is used to get the section news from the nytimes news, using the API
     * @param {*} url 
     * @param {*} callback 
     */
    function getSectionNews(url, callback) {
        request(url, function (error, response, body) {
            // Http request error 
           if (error) {
               return callback(error, null, null);
           }

           // Pre-process the data
           let rawData = JSON.parse(body).results;
           let cleanData = [];
           rawData.forEach(function (item, index) {
                let news = validateSectionNews(item);
                if (news.isValid) {
                    // Remove the redundant key
                    delete news.isValid;
                    // If the main section is not in the list
                    if (NY_SECTIONS_LIST.indexOf(news.sectionId) < 0) {
                        news.sectionCSSType = "anyother";
                    }
                    // Format the time 
                    news.publishedAt = news.publishedAt.split("T")[0];
                    cleanData.push(news);
                }
           });
           callback(null, response.statusCode, {
               "status": "ok", 
               "results": cleanData.slice(0, NY_MAX_NUM_SHOWN)
            });
        })
    }

    /**
     * Function that is used to validate the section article
     * @param {*} article
     */
    function validateSectionNews(article) {

        function check(item) {
            return (
                item === null || item === "" || item === undefined || item === NaN
            );
        }

        // Find out the valid image if there exists one
        let validImageURL = NY_DEFAULT_IMAGE;
        // Ensure that the artilce has the "multimedia" element
        article.multimedia && Array.from(article.multimedia).some(function (item, index) {
            if (item.width >= NY_IMAGE_MIN_WIDTH && validImageURL === NY_DEFAULT_IMAGE) {
                validImageURL = item.url;
                return true;
            } 
        });

        // Pre-store the values
        let ret = {
            "isValid": true,
            "title": article.title,
            "imageURL": validImageURL,
            "sectionId": article.section,
            "sectionCSSType": article.section,
            "articleId": article.url,
            "publishedAt": article.published_date,
            "description": article.abstract,
            "url": article.url,
            "source": "nytimes"
        };

        // Validate the values
        Object.keys(ret).forEach(function (key) {
            if (key !== "isValid" && check(ret[key])) {
                // The article is invalid
                ret.isValid = false;
            }
        });

        return ret;
    }

}

module.exports = nytimes;
