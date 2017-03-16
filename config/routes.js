// Purpose of this file: routes will live here

// do a module.exports so the app routes can be included in the server.js file
// create routes that render home and saved handlebars

module.exports = function(router) {

    // this route renders the home handlebars page
    router.get('/', function(req, res) {
        res.render('home');
    });


    // this route renders the saved handlebars page
    router.get('/saved', function(req, res) {
        res.render('saved');
    });

};