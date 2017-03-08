// will contain CRUD functionality

// bring in Note.js script and date.js scripts
var Note = require('../scripts/scrape');
var makeDate = require('../scripts/date');


module.exports = {

    // (1) *** GET function that will find all of the notes associated with id in question

    get: function(data,cb) {

        Note.find({

            _headlineID: data._id

        }, cb);

    },

    // (2) *** SAVE function will take in data from the user and the call back function

    save: function (data, db) {

        // create an object that will have the headline id associated with the note that is being created
        // plus the date from the makeDate function that was brought in with the module.export
        //  plus the noteText which is what the user types in
        var newNote = {

            _headlineID: data._id,
            date: makeDate(),
            noteText: data.noteText

        };

        // create the note and run a function that creates an error or a document
        // alert if there is an error
        // otherwise pass the document the new note that was created to the call  back function
        Note.create(newNote, function (err, doc) {

            if(err) {

                console.log(err);

            }
            else {

                console.log(doc);
                cb(doc);

            }

        });

    },

    // (2) *** DELETE function will remove the note associated with the article

    delete: function(data,cb) {

        Note.remove({

            _id: data._id

        }, cb);

    }

};


