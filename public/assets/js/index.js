// Purpose of this file : the javascript that will affect the index page will live here

$(document).ready(function () {

    // set a reference to the article-container div where all the dynamic content will go
    // add event listeners to any dynamically generated article (save article)
    // add "scrape new" article buttons

    var articleContainer = $('.article-container');
    $(document).on('click', '.btn.save', handleArticleSave);
    $(document).on('click', '.scrape-new', handleArticleSrape);

    // Once page is ready, run the  initPage function to kick things off
    initPage();

    function initPage() {

        // empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get('/api/headlines?saved=false')
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
                '<div class="alert alert-info text-center">',
                '<h4>Uh oh. Looks like we do not have any new articles.</h4>',
                '</div>',
                '<div class="panel panel-default">',
                '<div class="panel-heading text-center">',
                '<h3>What would you like to do?</h3>',
                '</div>',
                '<div class="panel-body text-center">',
                // '<h4><a class="scrape-new">Try Scraping New Articles</a></h4>',
                '<button type="button" class="btn btn-primary btn-lg scrape-new">Try Scraping New Articles</button>',
                // '<h4><a href="/saved">Go to Saved Articles</a></h4>',
                '<button href="/saved" type="button" class="btn btn-primary btn-lg scrape-new">Go to Saved Articles</button>',
                '</div>',
                '</div>'
            ].join(""));

        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {

        // this function is triggered when the user wants to save an article
        // when I rendered the article initially, I attached a javascript object containing the deadline id to the element using the .data method. Here I retrieve that

        var articleToSave = $(this).parents('.panel').data();
        articleToSave.saved = true;

        // using patch method to be semantic since this is an update to an existing record in the collection

        $.ajax({
            method: 'PATCH',
            url: '/api/headlines',
            data: articleToSave
        })
            .then(function (data) {

                // if successful mongoose will send back an object containing a key of 'ok' with the value of 1 which casts to true

                if(data.ok) {

                    // run the initPage function again, this will reload the entire list of articles
                    initPage();

                }

            });

    }

    function handleArticleSrape() {

        // this function handles the user clicking an 'scrape new article'

        $.get('/api/fetch')
            .then(function (data) {

                // if I am able to successfully scrape the website and compare the articles to those
                // already in the collection, re render the articles on the page and let the user know how many unique articles they were able to save

                initPage();
                bootbox.alert('<h3 class="text-center m-top-80">' + data.message + '</h3>');

            });

    }

});