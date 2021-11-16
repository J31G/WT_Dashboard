const express = require('express');
const dashboardUsers = require('../models/users');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/questions', checkAuth, async (req, res) => res.render('faqs/discord.ejs', {
  user: req?.user,
  allUsers: await dashboardUsers.find(),
}));

module.exports = router;
