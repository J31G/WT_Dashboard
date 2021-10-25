const express = require('express');
const eventsDB = require('../models/events');
const eventUserDB = require('../models/eventUserUpload');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

// GET
router.get('/halloween', checkAuth, async (req, res) => res.render('events/halloween.ejs', {
  user: req?.user,
  events: await eventsDB.find({}).sort({ created_date: -1 }),
  eventUsers: await eventUserDB.find({ upload_date: { $ne: null } }).sort({ created_date: -1 }),
}));

// POST
router.post('/halloween/create-event', checkAuth, async (req, res) => {
  if (!req?.body?.eventName || !req?.body?.eventReward || !req?.body?.eventDescription) {
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
  });
  res.status(200);
  return res.redirect('/events/halloween');
});
router.post('/halloween/event-change', (req, res) => {
  const status = req?.body?.status === 'Completed' ? 'In progress' : 'Completed';
  eventsDB.updateOne({ _id: req?.body?.id }, { status }, { upsert: true }, (err) => {
    if (err) res.send(500, { error: err });
    res.status(200);
    return res.redirect('/events/halloween');
  });
});
router.post('/halloween/event-delete', (req, res) => {
  eventsDB.deleteOne({ _id: req?.body?.id }, (err) => {
    if (err) res.send(500, { error: err });
    res.status(200);
    return res.redirect('/events/halloween');
  });
});

module.exports = router;
