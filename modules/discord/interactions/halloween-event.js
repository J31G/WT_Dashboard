const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const urlCrypt = require('url-crypt')(process.env.CRYPTO_KEY);
const moment = require('moment');
require('moment-countdown');
// require('dotenv').config();

const eventsDB = require('../../../models/events');
const eventUserUpload = require('../../../models/eventUserUpload');
const { translate } = require('../../translate/translate');

module.exports.halloween = async (discordClient, interaction) => {
  const todaysEvent = await eventUserUpload.findOne({
    created_date: { $gte: moment().startOf('day') },
    userID: interaction.user.id,
    event_name: 'halloween',
  });
  const timeRemaining = moment().startOf('day').add(1, 'days').countdown();
  const year = new Date();
  const language = interaction.customId.substring(16).toUpperCase();

  let event = {};

  // Have they already hit the button today?
  if (todaysEvent?.userID) {
    // Have they already submitted today?
    if (todaysEvent?.upload_date) {
      const translatedMessage = await translate(
        `You have already submitted the daily event; please wait **${timeRemaining}** to participate tomorrow.`,
        language,
      );
      interaction.reply({ content: translatedMessage.text, ephemeral: true });
      return;
    }
    // If not, find the event they had below
    event = await eventsDB.findOne({ name: todaysEvent.event });
  } else {
    // Check to see what they have already done
    const whatTheyHaveDone = await eventUserUpload.find(
      {
        userID: interaction.user.id,
        event_name: 'halloween',
      },
      'event -_id',
    );

    // Randomly pick one that they haven't
    const allEvents = await eventsDB.find({
      status: 'In progress',
      event_name: 'halloween',
      name: { $nin: whatTheyHaveDone.map((e) => e?.event) },
    });
    event = allEvents[Math.floor(Math.random() * allEvents.length)];

    // If not events left
    if (allEvents.length === 0) {
      const translatedMessage = await translate(
        'We have run out of events, please check back later.',
        language,
      );
      interaction.reply({ content: translatedMessage.text, ephemeral: true });
      return;
    }

    await eventUserUpload.create({
      userID: interaction.user.id,
      username: interaction.user.username,
      event: event.name,
      event_name: 'halloween',
    });
  }

  const eventName = await translate(event.name, language);
  const eventDescription = await translate(event.description, language);
  const eventReward = await translate(event.reward, language);

  // Create URL
  const data = {
    userID: interaction.user.id,
    username: interaction.user.username,
    event: event.name,
    language,
  };

  const base64 = urlCrypt.cryptObj(data);
  const url = `https://apps.wolfteam.info/submit/upload/${base64}`;

  const embed = new MessageEmbed()
    .setColor(3447003)
    .setTitle(eventName.text)
    .setDescription(eventDescription.text)
    .addField('Rewards', eventReward.text, true)
    .addField(
      'Time Remaining',
      `${timeRemaining.hours}h, ${timeRemaining.minutes}m, ${timeRemaining.seconds}s`,
      true,
    )
    .setFooter({
      text: `© BigBOT ${year.getFullYear()}`,
      iconURL: discordClient.user.avatarURL,
    })
    .setTimestamp();

  const row = new MessageActionRow().addComponents(
    new MessageButton().setURL(url).setLabel('Submit').setStyle('LINK'),
  );

  interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
};
