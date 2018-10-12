const express = require('express');
const router = express.Router();

//Bring in article model
let Article = require('../models/article');

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
router.post('/add', function (req, res) {
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

//validator error check
// app.post('/articles/add',
//     [
//         check('title').isLength({ min: 1 }).trim().withMessage('Title required'),
//         check('author').isLength({ min: 1 }).trim().withMessage('Author required'),
//         check('body').isLength({ min: 1 }).trim().withMessage('Body required')
//     ],
//     (req, res, next) => {

//         let article = new Article({
//             title: req.body.title,
//             author: req.body.author,
//             body: req.body.body
//         });

//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             console.log(errors);
//             res.render('add_article',
//                 {
//                     article: article,
//                     errors: errors.mapped()
//                 });
//         }
//         else {
//             article.title = req.body.title;
//             article.author = req.body.author;
//             article.body = req.body.body;

//             article.save(err => {
//                 if (err) throw err;
//                 req.flash('success', 'Article Added');
//                 res.redirect('/');
//             });
//         }
//     });

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

module.exports = router;