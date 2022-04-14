const express = require('express');
const userDB = require('../models/users');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/announcements', checkAuth, async (req, res) => {
  res.render('tools/announcements.ejs', {
    user: req?.user,
    allUsers: await userDB.find(),
  });
});

router.post('/announcements/create', checkAuth, async (req, res) => {
  console.log('It did a thing');
  res.status(200);
  return res.redirect('/tools/announcements');
});

module.exports = router;
