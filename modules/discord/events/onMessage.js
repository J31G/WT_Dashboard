const moment = require('moment');
const discordTag = require('../../../models/taggedTeamGamigo');
const messageCount = require('../../../models/messageCount');
const { languageDetection } = require('../helper/languageDetection');
const { bannedURLDetection } = require('../helper/bannedURL');
const { faqMessage } = require('../helper/faqDetection');

module.exports.onDiscordMessage = async (discordClient, message) => {
  // Check if message is from a bot (Important to stop loops)
  if (message.author.bot) return;

  // URL Detection
  await bannedURLDetection(message, discordClient);

  // Language Detection
  await languageDetection(message);

  // FAQ Detections
  await faqMessage(message, discordClient);

  // Log user if they use the team gamigo tag
  if (message.content.includes('<@&829731272716189746>')) {
    await discordTag.create({
      discord_user_id: message.author.id,
      discord_username: message.author.username,
      discord_message: message.content,
    });
    const msg = await message.reply({ content: 'Please only tag Team Gamigo for game emergencies! Continuing to tag the group will result in a ban. \n\nIf you are after game support, please submit a ticket: https://www.aeriagames.com/contact' });
    setTimeout(() => msg.delete(), 10000);
  }

  // Log message count
  await messageCount.findOneAndUpdate({
    date_time: { $gte: moment().startOf('day') },
  }, { $inc: { count: 1 } }, { upsert: true, new: true });
};
