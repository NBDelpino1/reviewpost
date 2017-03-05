// set up node server and include routes




// require the dependencies
var express = require('express');

// set up port
var PORT = process.env.PORT || 8080;

// instantiate express
var app = express();

// set up express router
var router = express.Router();

// designate the public folder the the static directory
app.use(express.static(__dirname + '/public'));

// have every request go through router middleware
app.use(router);

// listen on the port
app.listen(PORT, function(){
    console.log('listening on port:' + PORT);
});