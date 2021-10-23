const mongoose = require('mongoose');

module.exports = mongoose.model('events', new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  reward: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'In progress',
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
}));
