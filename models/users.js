const mongoose = require('mongoose');

module.exports = mongoose.model('users', new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
  },
  discordID: {
    type: String,
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
}));
