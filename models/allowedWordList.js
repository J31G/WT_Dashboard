const mongoose = require('mongoose');

const allowedWordList = new mongoose.Schema({
  word: {
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

module.exports = mongoose.model('AllowedWordList', allowedWordList);
