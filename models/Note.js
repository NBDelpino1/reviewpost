// will hold Mongoose schema associated with notes,
// will indicate what pieces to save in the table i.e. article name, link and notes associated with it etc

// will hold Mongoose schema associated with notes,
// will indicate what pieces to save in the table i.e. article name, link and notes associated with it etc

// require Mongoose npm package
var mongoose = require('mongoose');

// create schema using mongoose schema function
var Schema = mongoose.Schema;

// create app schema that requires a headlineID (associated article that the note will be attached too) and a noteText (the note the user types in)
var headlineSchema = new Schema({
    _headlineID: {
        type: String,
        ref: 'Headline'

    },
    date: String,
    saved: {
        noteText: String
    }
});

var Note = mongoose.model('Note', headlineSchema);

// export out note model for use throughout the app
module.exports = Note;