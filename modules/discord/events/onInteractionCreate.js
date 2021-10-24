module.exports.onDiscordInteraction = async (discordClient, interaction) => {
  if (!interaction.isButton()) return;
  interaction.reply('You pressed my button!');
};
