const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportLocal = require('passport-local');

//Bring in article model
let User = require('../models/user');


//register form
router.get('/register', (req, res) => {
    res.render('register');
});

//register process
router.post('/register', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const new_password = req.body.new_password;
    const email = req.body.email;
    const username = req.body.username;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('new_password', 'Password do not match').equals(req.body.password);
    req.checkBody('username', 'Username is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                else {
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        else {
                            req.flash('success', 'You are registered and can loginIn');
                            console.log('You are registered and can loginIn');
                            res.redirect('/users/login');
                        }

                    });
                }
            });
        });
    }

});


//login form
router.get('/login', (req, res) => {
    res.render('login');
});

//login process
router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('login', {
            errors: errors
        });
    } else {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login',
            failureFlash: true,


        })(req, res, next);
        req.flash('success', 'You are registered and can loginIn');
    }


});

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
