const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', function () {
    console.log('connected to MongoDB');
});


//check for db error
db.on('error', function (err) {
    console.log(err);
});

//init app
const app = express();

//Bring in model
let Article = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', (req, res) => {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', {
                title: 'List of Articles -',
                articles: articles
            });
        }
    });

    // let articles = [
    //     {
    //         id: 1,
    //         title: 'Article one',
    //         body: 'This Article one'
    //     },
    //     {
    //         id: 2,
    //         title: 'Article two',
    //         body: 'This Article Two'
    //     },
    //     {
    //         id: 3,
    //         title: 'Article three',
    //         body: 'This Article Three'
    //     }
    // ];

});

//add route
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'add article'
    });
});

//get single article
app.get('/article/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        });
    });
});

//loading edit form
app.get('/article/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

//add submit route
app.post('/articles/add', function (req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            res.redirect('/');
        }
    });

});

//update submit route
app.post('/articles/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id }

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            res.redirect('/');
        }
    });

});


app.listen(3000, () => {
    console.log('server strted ..');
});