// Purpose of th file is to set up node server and include routes

// require in express
// set port
// set port to use the public folder as the static directory
// listen and tell me when it's listening
// set up body parser
// add express handlebars
// go to handlebars and get the template needed for the main.handlebars file (this code is not here, see main.handlebars)
// set up mongo and mongoose, test db connection


// require dependencies : express, body parser, handlebars, mongoose,
var express = require('express');
var mongoose = require('mongoose');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');

// set up port : designated to 8080 ; can also be the host's designated port
var PORT = process.env.PORT || 8080;

// instantiate express app
var app = express();

// set up an express router
var router = express.Router();

// designate the public folder as the static directory
app.use(express.static(__dirname + '/public'));

// connect handlebars to the app
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));

// set up body parser in the app
app.use(bodyParser.urlencoded({
    extended: false
}));

// have every request go through the router middleware
app.use(router);

// if deployed, use the deployed db. Otherwise use the db on local machine
var db = process.env.MONGODB_URI || 'mongodb://localhost/reviewpost';

// connect mongoose to database
mongoose.connect(db, function(error){
    // log any errors connecting with mongoose
    if (error){
        console.log(error);
    }
    // or log a success message
    else {

        console.log('mongoose connection successful')
    }
});

// listen on the port
app.listen(PORT, function(){
    console.log('listening on port:' + PORT);
});