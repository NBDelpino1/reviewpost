// will contain CRUD functionality

//bring in scrape.js script and date.js scripts
var scrape = require('../scripts/scrape');
var makeDate = require('../scripts/date');

// bring in Headline and Note mongoose models
var Headline = require('../models/Headline');

// functionality for saving and deleting articles goes here so they can be used throughout the entire program
module.exports = {

    // (1) *** FETCH will run the scrape function | grab all the articles | insert them into the Headline collection in the Mongo db

    //pass in cb into function then run scrape
    fetch: function(cb) {
        scrape(function(data){

            // set data to articles
            var articles = data;

            // go through each article and run the makeDate function to insert the date and set saved to false
            for (var i = 0; i < articles.length; i ++) {

                articles[i].date = makeDate();
                articles[i].saved = false;
            }

            // run Mongo function that will take the headline and insert it that collection all the articles,
            // don't care if the articles are ordered so that was set to false
            // function(err,docs) ...this is in case one of the articles throws and error it will not stop the process, it will just skip over it and keep going onto the next article until done
            Headline.collection.insertMany(articles, {ordered:false}, function(err,docs) {

                // call back returns any errors
                cb(err, docs);

            });

        });
    },
    // (2) *** DELETE will remove an article

    // whichever headline was queried will be removed
    delete : function(query, cb) {
        Headline.remove(query, cb);
    },

    // already made a ay to insert articles INTO the headline collection - need a way to get them OUT (use get function)
    get: function(query, cb) {

        // find all the headlines in the query and sort them most recent to least recent
        Headline.find(query)
            .sort({

                _id: -1

            }) // when done pass all those docs to the call back function
            .exec(function(err,doc) {

                cb(doc);

            });
    },

    // (3) *** UPDATE will update the articles

    // update new articles scraped with the relevant id and update any information that is passed to those articles with that information as well
    update: function(query,cb) {
        Headline.update({_id: query._id}, {

            $set: query
        }, {}, cb);

    }

};
