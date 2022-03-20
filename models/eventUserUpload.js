const mongoose = require('mongoose');

module.exports = mongoose.model(
  'eventUserUpload',
  new mongoose.Schema({
    userID: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    IGN: {
      type: String,
    },
    URL: {
      type: String,
    },
    event: {
      type: String,
      required: true,
    },
    created_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    upload_date: {
      type: Date,
    },
    event_name: {
      type: String,
      required: true,
    },
  }),
);
