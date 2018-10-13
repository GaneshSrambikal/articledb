const express = require('express');
const router = express.Router();

//Bring in article model
let User = require('../models/user');


//register form
router.get('/register', (req, res) => {
    res.render('register');
});
