const express = require('express');
const router = express.Router();

const Folder = require('../models/Folders.model');

router.get('/newfolder', (req, res) => res.render('users/newfolder'));

router.post('/newfolder', (req, res, next) => {
    const { title, keywords, description } = req.body;
   
    Folder.create({
            title,
            keywords,
            description
    })   
    .then(folder => res.redirect('/profile'))
    .catch(err => next(err));
  });

module.exports = router;
