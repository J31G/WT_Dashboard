require('dotenv').config();
const { halloween } = require('../interactions/halloween-event');
const { questions } = require('../interactions/question');

module.exports.onDiscordInteraction = async (discordClient, interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.substring(0, interaction.customId.length - 3) === 'halloween-event') halloween(discordClient, interaction);
  if (interaction.customId.substring(0, interaction.customId.length - 3) === 'question') questions(discordClient, interaction);
};
