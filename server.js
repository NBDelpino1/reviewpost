// Purpose of th file is to set up node server and include routes

// require in express
// set port
// set port to use the public folder as the static directory
// listen and tell me when it's listening

// require dependency : express
var express = require('express');

// set up port : designated to 8080 ; can also be the host's designated port
var PORT = process.env.PORT || 8080;

// instantiate express app
var app = express();

// set up an express router
var router = express.Router();

// designate the public folder as the static directory
app.use(express.static(__dirname + '/public'));

// have every request go through the router middleware
app.use(router);

// listen on the port
app.listen(PORT, function(){
    console.log('listening on port:' + PORT);
});