const express = require('express');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

// GET
router.get('/halloween', checkAuth, async (req, res) => res.render('events/halloween.ejs', { user: req?.user }));

// POST

module.exports = router;
