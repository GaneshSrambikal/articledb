const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const { check, validationResult } = require('express-validator/check');
const expressMessage = require('express-messages');
const config = require('./config/database');
const passport = require('passport');

mongoose.connect(config.database);
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

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true

}));

//express messages middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = expressMessage(req, res);
    next();
});

//express validator middleaware

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});


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


//route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

app.listen(3000, () => {
    console.log('Server Started at Port 3000..');
});