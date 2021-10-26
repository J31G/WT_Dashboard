const express = require('express');
const gamigoTag = require('../models/taggedTeamGamigo');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/team-gamigo', checkAuth, async (req, res) => res.render('reports/team-gamigo.ejs', {
  user: req?.user,
  gamigoTag: await gamigoTag.find().sort({ date_time: -1 }),
}));

module.exports = router;
