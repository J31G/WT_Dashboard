const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userDB = require('../models/users');
const messageCountDB = require('../models/messageCount');
const xHatersCountDB = require('../models/xHaters');
const { initialisePassport } = require('../modules/init/passport');
const { queryStats } = require('../modules/init/discord');

const eventsRoute = require('./events');
const submitRoute = require('./submit');
const reportsRoute = require('./reports');
const listsRoute = require('./lists');
const faqsRoute = require('./faqs');
const logsRoute = require('./logs');
const toolsRoute = require('./tools');

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
router.use('/faqs', faqsRoute);
router.use('/reports', reportsRoute);
router.use('/logs', logsRoute);
router.use('/tools', toolsRoute);

// GET
router.get('/', checkAuth, async (req, res) => {
  res.render('index.ejs', {
    user: req?.user,
    allUsers: await userDB.find(),
    discordStats: await queryStats(),
    msgCount: await messageCountDB.findOne({
      date_time: { $gte: moment().startOf('day') },
    }),
    msgCountYesterday: await messageCountDB.findOne({
      date_time: { $gte: moment().subtract(1, 'day').startOf('day') },
    }),
    xHaterCount: await xHatersCountDB.findOneAndUpdate(
      {},
      {
        $inc: { currentCount: 1 },
      },
      { upsert: true, new: true },
    ),
  });
});
router.get('/login', checkNotAuth, (req, res) => res.render('login.ejs'));

// POST
router.post(
  '/login',
  checkNotAuth,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
);
router.post('/logout', checkAuth, (req, res) => {
  req.logOut();
  res.redirect('/login');
});
router.post('/change-password', async (req, res) => {
  await userDB.findOneAndUpdate(
    { email: req?.body?.email },
    {
      password: await bcrypt.hash(req?.body?.password, 10),
    },
    { upsert: true },
  );
  await initialisePassport();
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
