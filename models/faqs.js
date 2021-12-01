const mongoose = require('mongoose');

module.exports = mongoose.model('FAQs', new mongoose.Schema({
  keyword: {
    type: Array,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  external_link: {
    type: String,
  },
}));
