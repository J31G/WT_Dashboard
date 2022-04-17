const mongoose = require('mongoose');

module.exports = mongoose.model('xHaters', new mongoose.Schema({
  currentCount: {
    type: Number,
    required: true,
  },
}));
