const express = require('express');
const router = express.Router();

//Bring in article model
let Article = require('../models/article');

let User = require('../models/user');

//add route
router.get('/add', function (req, res) {
    res.render('add_article', {
        title: 'add article'
    });
});



//get single article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        });
    });
});

//loading edit form
router.get('/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

//add submit route
router.post('/add', ensureAuthenticated, function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //get errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    }
    else {
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

                req.flash('success', 'Article Added');
                res.redirect('/');
                console.log(article.title + " is added.");
            }
        });
    }



});



//update submit route
router.post('/edit/:id', function (req, res) {
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
            console.log(article.title + " is Updated.");
            res.redirect('/');
        }
    });

});

//delete
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id }

    Article.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
        console.log(req.params.id + " is deleted.");
    })


});

//access control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;