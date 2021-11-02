const mongoose = require('mongoose');

module.exports = mongoose.model('discordLogs', new mongoose.Schema({
  discordID: {
    type: String,
    required: true,
  },
  discordUsername: {
    type: String,
    required: true,
  },
  logEvent: {
    type: String,
    required: true,
  },
  logReason: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
}));
