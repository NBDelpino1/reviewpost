// Purpose of this file: functionality that Cheerio needs to scrape articles from whatever website.



// require the two packages (request and cheerio) which will make scrape possible

var request = require('request');
var cheerio = require('cheerio');

// create variable which I can then export at the end
// make call back

var scrape = function(cb){

    // use request package to request specified website with err, res and body which will have everything I get back
    request('http://www.nytimes.com', function(err,res,body){

        // assign dollar sign so I can use this kind of like how I use jQuery
        var $ = cheerio.load(body);

        // empty array that will hold the articles
        var articles = [];

        // magic happens here:
        // select all the *[theme-summaries]* and on each one of these *[theme-summaries]*....

        $('.theme-summary').each(function(i,element) {

            // grab the text and cut off any white space at the end for *[story-heading and summary]* and store each into a variable
            var head = $(this).children('.story-heading').text().trim();
            var sum = $(this).children('.summary').text().trim();

            // if head and sum exist [meaning if the scaper was able to get the text from both of the the children objects] run rejex method [all it really does is clean up the text with white space]
            if(head && sum) {

                var headNeat =  head.replace(/(\r\n|\n|\r\t|\s+)/gm, " ").trim();

                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s +)/gm, " ").trim();

                // next make an object out of headNeat and sumNeat and assign it to an attribute that will ne needed to be able to create an article in the model
                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat

                };

                // push the new dataToAdd into the articles array
                articles.push(dataToAdd);
            }

        });
        console.log(articles)
        // call back will send me articles that have now filled up the previously created array which was empty before
        cb(articles);


    });

};

// export so I can use this throughout the program
module.exports = scrape;