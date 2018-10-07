const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

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

// home route
app.get('/', (req, res) => {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', {
                title: 'hello',
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


app.listen(3000, () => {
    console.log('server strted ..');
});