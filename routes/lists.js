const express = require('express');
const bannedURL = require('../models/bannedURL');
const allowedWords = require('../models/allowedWordList');
const dashboardUsers = require('../models/users');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/banned-url', checkAuth, async (req, res) => res.render('lists/banned-url.ejs', {
  user: req?.user,
  bannedURL: await bannedURL.find(),
}));
router.get('/allowed-word', checkAuth, async (req, res) => res.render('lists/allowed-word.ejs', {
  user: req?.user,
  allUsers: await dashboardUsers.find(),
  allowedWords: await allowedWords.find().sort({ created_date: -1 }),
}));

module.exports = router;
