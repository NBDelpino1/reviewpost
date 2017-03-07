// routes will live here

// bring in scrape function from scripts directory
var scrape = require('../scripts/scrape');

// bring in headlines and notes from the controller
var headlinesController = require('../controllers/headlines');
var notesController = require('../controllers/notes');

module.exports = function(router) {

    // leads to home.handlebars
    router.get('/', function(req, res) {
        res.render('home');
    });


    // leads to saved.handlebars
    router.get('/saved', function(req, res) {
        res.render('saved');
    });

    // api route to fetch all the articles (req will run the fetch function in headline.js and return a res)
    router.get('/api/fetch', function (req,res) {


        // go to headlines controller and run the fetch function then a pop up a message to the user
        // if there are no new articles added or none at all say so
        // otherwise tell the user how many articles were added
        headlinesController.fetch(function (err,docs) {

            if(!docs || docs.insertedCount === 0) {

                res.json({

                    message: 'No new articles today. Please check back tomorrow!'

                });

            }
            else {

                res.json({

                    message: 'Added ' + docs.insertedCount + ' new articles!'

                });

            }

        });

    });

    // api route goes with the get user input and  grab all the headlines that are in the db
    // give user what they specify
    // otherwise return everything
    router.get('/api/headlines', function (req,res) {

        var query = {};
        if(req.query.saved) {

            query = req.query;
        }
        
        headlinesController.get(query, function (data) {

            res.json(data);
            
        });
        
    });

    router.delete('/api/headlines/:id', function (req,res) {

        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function (err,data) {

            res.json(data);
            
        });

    });

    // api route to update headlines if needed
    router.patch('/api/headlines', function (req,res) {

        headlinesController.update(req.body, function (err,data) {

            res.json(data);
            
        });

    });

    // api route to grab all notes associated with an article and display it to the user
    router.get('/api/notes/:headline_id?', function (req,res) {

        var query = {};
        if(req.params.headline_id) {

            query._id = req.params.headline_id;

        }

        notesController.get(query, function (err,data) {

            res.json(data);

        });

    });

    // api route to delete notes
    router.delete('/api/notes/:id', function (req,res) {

        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function (err,data) {

            res.json(data);

        });
        
    });

    // api route to display notes
    router.post('/api/notes', function (req,res) {

        notesController.save(req.body, function (data) {

            res.json(data);

        });

    });

};