const express = require('express');
const userDB = require('../models/users');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/tools', checkAuth, async (req, res) => {
  res.render('tools/team-gamigo.ejs', {
    user: req?.user,
    allUsers: await userDB.find(),
  });
});

module.exports = router;
