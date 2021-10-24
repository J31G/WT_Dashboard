const mongoose = require('mongoose');

const bannedURL = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  added_by: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('BannedURL', bannedURL);
