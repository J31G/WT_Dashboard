const mongoose = require('mongoose');

const discordGroupTag = new mongoose.Schema({
  discord_user_id: {
    type: String,
    required: true,
  },
  discord_username: {
    type: String,
    required: true,
  },
  date_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  discord_message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('DiscordGroupTag', discordGroupTag);
