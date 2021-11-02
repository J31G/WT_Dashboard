const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const userDB = require('../models/users');
const { initialisePassport } = require('../modules/init/passport');

const eventsRoute = require('./events');
const submitRoute = require('./submit');
const reportsRoute = require('./reports');
const listsRoute = require('./lists');
const logsRoute = require('./logs');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};
const checkNotAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  return res.redirect('/');
};

// Other routes
router.use('/events', eventsRoute);
router.use('/submit', submitRoute);
router.use('/lists', listsRoute);
router.use('/reports', reportsRoute);
router.use('/logs', logsRoute);

// GET
router.get('/', checkAuth, async (req, res) => res.render('index.ejs', { user: req?.user, allUsers: await userDB.find() }));
router.get('/login', checkNotAuth, (req, res) => res.render('login.ejs'));

// POST
router.post('/login', checkNotAuth, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));
router.post('/logout', checkAuth, (req, res) => {
  req.logOut();
  res.redirect('/login');
});
router.post('/change-password', async (req, res) => {
  await userDB.findOneAndUpdate({ email: req?.body?.email }, {
    password: await bcrypt.hash(req?.body?.password, 10),
  }, { upsert: true });
  await initialisePassport();
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
