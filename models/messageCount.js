const mongoose = require('mongoose');

module.exports = mongoose.model('messageCount', new mongoose.Schema({
  date_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
}));
