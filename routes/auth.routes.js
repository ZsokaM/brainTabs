const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/User.model');

router.get('/signup', (req, res) => { res.render('auth/signup')});

router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;
 
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username, email and password' });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }
      bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hashSync(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          email,
          password: hashedPassword
        });
      })
      .then(user => res.redirect('/login'))
    })
    .catch(err => next(err));
});

router.get('/login', (req, res, next) => res.render('auth/login', {errorMessage: req.flash('error')}));

router.post('/login',
  passport.authenticate('local', {
      successRedirect: '/private',
      failureRedirect: '/login',
      failureFlash: true
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});
  
  
module.exports = router;
