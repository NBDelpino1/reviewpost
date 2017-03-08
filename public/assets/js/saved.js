// will handle the saved articles page

$(document).ready(function(){

    // getting a reference to the article container div that I will be rendering all articles inside of
    var articleContainer = $('.article-container');

    // adding event listeners fr dynamically generating buttons for deleting articles
    // pulling up articles notes, saving notes and deleting article notes

    $(document).on('click', '.btn.delete', handleArticleDelete);
    $(document).on('click', '.btn.notes', handleArticleNotes);
    $(document).on('click', '.btn.save', handleNoteSave);
    $(document).on('click', '.btn.note-delete', handleNoteDelete);

    // initPage kicks everything off when the page is loaded

    initPage();

    function initPage() {

        // empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get('/api/headlines?saved=true')
            .then(function (data) {

                // if there are headlines - render them to the page
                if(data && data.length) {
                    renderArticles(data);
                }
                else {

                    // otherwise render a message explaining there are none to render
                    renderEmpty();

                }

            });

    }

    function renderArticles(articles) {

        // function handles appending HTML containing article data to the page
        // pass an array of JSON data containing all avaliable articles into the db

        var articlePanels = [];

        // pass each article JSON object to the createpanel function which returns a panel with article inside
        for(var i = 0; i < articles.length; i ++) {

            articlePanels.push(createPanel(articles[i]));

        }

        //once I have all the HTML for the article stored in the aticlePanels array
        //append them to the articlePanels container

        articleContainer.append(articlePanels);

    }

    function createPanel(article) {

        // this function takes in a single JSON object for an article/headline
        //it constructs a jQuery element containing all of the formatted HTML for the article panel

        var panel =
            $([
                '<div class="panel panel-default">',
                '<div class="panel heading">',
                '<h3>',
                article.headline,
                '<a class="btn btn-success save">',
                'Save Article',
                '</a>',
                '</h3>',
                '</div>',
                '<div class="panel body">',
                article.summary,
                '</div>',
                '</div>'
            ].join(""));

        // attach thr article's id to the jQuery element
        // will use this when trying to figure out which articlke the user wants to save

        panel.data('_id', article._id);

        // return the constructed panel jQuery element

        return panel;

    }


    function renderEmpty() {

        // this function renders some HTML to the page explaining we don't have any articles to view
        // using a joined array of HTML string data because it's easier to read/change than a concatenated string

        var emptyAlert =
            $([
                '<div class="alert alert-warning text-center">',
                '<h4>Uh oh. Looks like we do not have any new articles.</h4>',
                '</div>',
                '<div class="panel panel-default">',
                '<div class="panel-heading text-center">',
                '<h3>What would you like to do?</h3>',
                '</div>',
                '<div class="panel-body text-center">',
                '<h4><a class="scrape-new">Try Scraping New Articles</a></h4>',
                '<h4><a href="/saved">Go to Saved Articles</a></h4>',
                '</div>',
                '</div>'
            ].join(""));

        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data){

        // this function handles rendering note list items to the notes model
        // setting up an array of notes to render after finishing
        // also setting up a currentNote variable to temporarily store each note

        var notesToRender = [];
        var currentNote;
        // if there are no notes, just display a message explaining this
        if(!data.notes.length){

            currentNote = [
                '<li class="list-group-item">',
                'No notes for this article yet',
                '</li>'
            ].join("");
            notesToRender.push(currentNote);

        }
        // if there are notes, go through each one
        else {
            for(var i=0; i < data.notes.length; i ++) {
                // construct an li element to contain the noteText and a delete button
                currentNote = $([
                    '<li class="list-group-item note">',
                    data.notes[i].noteText,
                    '<button class="btn btn-danger note-delete">x</button>',
                    '</li>'
                ].join(""));

                // store the note id on the delete button for easy access when trying to delete
                currentNote.children('button').data('_id', data.notes[i]._id);

                // adding currentNote to the notesToRender array
                notesToRender.push(currentNote);

            }

        }

        // now append the notesToRender to the note-container inside the note model
        $('.note-container').append(notesToRender);

    }

    function handleArticleDelete() {
         // this function handles deleting articles/headlines
        // grab the id of the article to delete from the panel element the delete button sits inside

        var articleToDelete = $(this).parents('.panel').data();

        // using a delete method just to be semantic since I am deleting an article/headline

        $.ajax({
            method: 'DELETE',
            url: '/api/headlines' + articleToDelete._id
        }).then(function (data) {
            // if this works out, run initPage again which will render a list of saved articles
            if(data.ok){

                initPage();

            }

        });
    }

    function handleArticleNotes(){

        // this function handles opeing the notes modal and displaying the notes
        // grab the id of the article to get notes for fro the panel element the delete button sits inside

        var currentArticle = $(this).parents('.panel').data();
        //grab any notes with this headline/article id
        $.get('/api/notes/' + currentArticle._id).then(function (data) {

            // constructing the intial HTML to add to the notes modal
            var modalText = [
                '<div class="container-fluid text-center">',
                '<h4>Notes For Article: ',
                '</h4>',
                '<ul class="list-group note-container">',
                '</ul>',
                '<textarea placeholder="New Note" rows="4" cols="60"></textarea>',
                '<button class="btn btn-success save">Save Note</button>',
                '</div>'
            ].join("");

            // adding the formatted HTML to the note model
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });

            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };

            // adding some information about the article and article notes to the save butto for easy access when trying to add a new note
            $('.btn.save').data('article', noteData);

            // renderNotesList will populate the actual note HTML inside of the modal I just created

            renderNotesList(noteData);

        });
    }

    function handleNoteSave(){

        // this function handles what happens when a user tries to save a new note for an article
        // setting a variable to hold some formatted data about the note
        // grabbing the note typed into the input box

        var noteData;
        var newNote = $('.bootbox-body textarea').val().trim();

        // if there is data in the note input field, format it and post it to the '/api/notes'route and send the formatted noteData as well

        if(newNote){
            noteData = {
                _id: $(this).data('article')._id,
                noteText: newNote
            };
            $.post('/api/notes', noteData).then(function () {

                // when complete close the modal
                bootbox.hideAll();
            });

        }

    }

    function handleNoteDelete() {

        // this function handles the deletion of the notes
        // first grab the id of the note to be deleted
        // I stored this data on the delete button when I created it
        var noteToDelete = $(this).data('_id');

        // perform a delete request to '/api/notes' with the id of the note we are deleting as a parameter

        $.ajax({
            url: '/api/notes' + noteToDelete,
            method: 'DELETE'
        }).then(function () {

            // when done hide the modal
            bootbox.hideAll();

        });

    }

});