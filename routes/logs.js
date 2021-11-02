const express = require('express');
const discordLogs = require('../models/discordLogs');
const userDB = require('../models/users');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/discord', checkAuth, async (req, res) => res.render('logs/discord.ejs', {
  user: req?.user,
  allUsers: await userDB.find(),
  logs: await discordLogs.find().sort({ createdDate: -1 }),
}));

module.exports = router;
