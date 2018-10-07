const express = require('express');
const path = require('path');
//init app
const app = express();

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// home route
app.get('/', (req, res) => {
    let articles = [
        {
            id: 1,
            title: 'Article one',
            body: 'This Article one'
        },
        {
            id: 2,
            title: 'Article two',
            body: 'This Article Two'
        },
        {
            id: 3,
            title: 'Article three',
            body: 'This Article Three'
        }
    ];
    res.render('index', {
        title: 'hello',
        articles: articles
    });
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