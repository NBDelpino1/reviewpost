// routes will live here

module.exports = function(router) {

    // leads to homepage
    router.get('/', function(req, res) {
        res.render('home');
    });


    // leads to saved.handlebars
    router.get('/saved', function(req, res) {
        res.render('saved');
    });

}