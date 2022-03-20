const express = require('express');
const eventsDB = require('../models/events');
const eventUserDB = require('../models/eventUserUpload');
const userDB = require('../models/users');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

const defaultData = async (req) => ({
  user: req?.user,
  allUsers: await userDB.find(),
});

// GET
router.get('/halloween', checkAuth, async (req, res) =>
  res.render('events/halloween.ejs', {
    ...(await defaultData(req)),
    events: await eventsDB
      .find({ event_name: 'halloween' })
      .sort({ created_date: -1 }),
    eventUsers: await eventUserDB
      .find({ upload_date: { $ne: null }, event_name: 'halloween' })
      .sort({ created_date: -1 }),
  }),
);

router.get('/easter', checkAuth, async (req, res) =>
  res.render('events/easter.ejs', {
    ...(await defaultData(req)),
    events: await eventsDB
      .find({ event_name: 'easter' })
      .sort({ created_date: -1 }),
    eventUsers: await eventUserDB
      .find({ upload_date: { $ne: null }, event_name: 'easter' })
      .sort({ created_date: -1 }),
  }),
);

// POST
router.post('/halloween/create-event', checkAuth, async (req, res) => {
  if (
    !req?.body?.eventName ||
    !req?.body?.eventReward ||
    !req?.body?.eventDescription
  ) {
    res.status('500');
    return res.send({
      statusCode: 500,
      statusMessage: 'Data missing',
    });
  }
  eventsDB.create({
    name: req?.body?.eventName,
    reward: req?.body?.eventReward,
    description: req?.body?.eventDescription,
    event_name: 'halloween',
  });
  res.status(200);
  return res.redirect('/events/halloween');
});
router.post('/halloween/event-change', (req, res) => {
  const status =
    req?.body?.status === 'Completed' ? 'In progress' : 'Completed';
  eventsDB.updateOne(
    { _id: req?.body?.id },
    { status },
    { upsert: true },
    (err) => {
      if (err) res.send(500, { error: err });
      res.status(200);
      return res.redirect('/events/halloween');
    },
  );
});
router.post('/halloween/event-delete', (req, res) => {
  eventsDB.deleteOne({ _id: req?.body?.id }, (err) => {
    if (err) res.send(500, { error: err });
    res.status(200);
    return res.redirect('/events/halloween');
  });
});

router.post('/easter/create-event', checkAuth, async (req, res) => {
  if (
    !req?.body?.eventName ||
    !req?.body?.eventReward ||
    !req?.body?.eventDescription
  ) {
    res.status('500');
    return res.send({
      statusCode: 500,
      statusMessage: 'Data missing',
    });
  }
  eventsDB.create({
    name: req?.body?.eventName,
    reward: req?.body?.eventReward,
    description: req?.body?.eventDescription,
    event_name: 'easter',
  });
  res.status(200);
  return res.redirect('/events/easter');
});
router.post('/easter/event-change', (req, res) => {
  const status =
    req?.body?.status === 'Completed' ? 'In progress' : 'Completed';
  eventsDB.updateOne(
    { _id: req?.body?.id },
    { status },
    { upsert: true },
    (err) => {
      if (err) res.send(500, { error: err });
      res.status(200);
      return res.redirect('/events/easter');
    },
  );
});
router.post('/easter/event-delete', (req, res) => {
  eventsDB.deleteOne({ _id: req?.body?.id }, (err) => {
    if (err) res.send(500, { error: err });
    res.status(200);
    return res.redirect('/events/easter');
  });
});

module.exports = router;
