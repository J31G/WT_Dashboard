const mongoose = require('mongoose');

module.exports = mongoose.model('eventUserUpload', new mongoose.Schema({
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
    required: true,
  },
  URL: {
    type: String,
    required: true,
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
}));
