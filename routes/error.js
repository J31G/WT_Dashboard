const express = require('express');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('*', checkAuth, async (req, res) => res.render('error/404.ejs'));

module.exports = router;
