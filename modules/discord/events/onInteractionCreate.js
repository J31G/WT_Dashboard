const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
require('dotenv').config();
const urlCrypt = require('url-crypt')(process.env.CRYPTO_KEY);
const moment = require('moment');
require('moment-countdown');

const eventsDB = require('../../../models/events');
const { translate } = require('../../translate/translate');

module.exports.onDiscordInteraction = async (discordClient, interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.substring(0, interaction.customId.length - 3) !== 'halloween-event') return;

  // console.log(interaction.customId);
  // console.log(interaction.user.id, interaction.user.username);

  const allEvents = await eventsDB.find({ status: 'In progress' });
  const event = allEvents[Math.floor(Math.random() * allEvents.length)];
  const year = new Date();

  // Create URL
  const data = {
    userID: interaction.user.id,
    username: interaction.user.username,
    event: event.name,
  };
  const base64 = urlCrypt.cryptObj(data);
  const url = `https://apps.wolfteam.info/submit/upload/${base64}`;

  const language = interaction.customId.substring(16).toUpperCase();
  const eventName = await translate(event.name, language);
  const eventDescription = await translate(event.description, language);
  const eventReward = await translate(event.reward, language);
  const timeRemaining = moment().startOf('day').add(1, 'days').countdown();

  const embed = new MessageEmbed()
    .setColor(3447003)
    .setTitle(eventName.text)
    .setDescription(eventDescription.text)
    .addField('Rewards', eventReward.text, true)
    .addField('Time Remaining', `${timeRemaining.hours}h, ${timeRemaining.minutes}m, ${timeRemaining.seconds}s`, true)
    .setFooter(`© BigBOT ${year.getFullYear()}`, discordClient.user.avatarURL)
    .setTimestamp();

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(url)
        .setLabel('Submit')
        .setStyle('LINK'),
    );

  // console.log(allEvents);
  interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
};
