// will hold Mongoose schema associated with notes,
// will indicate what pieces to save in the table i.e. article name, link and notes associated with it etc

// require Mongoose npm package
var mongoose = require('mongoose');

// create schema using mongoose schema function
var Schema = mongoose.Schema;

// create app schema that requires a headline and a summary
// headline has to be unique so I don't scrape the same articles over and over again into the schema
// * saved initially set to false but will change if user decides they want to save the article
var headlineSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    date: String,
    saved: {
        type: Boolean,
        default: false
    }
});

var Headline = mongoose.model('Headline', headlineSchema);

// export out headline
module.exports = Headline;