const { MessageEmbed } = require('discord.js');
const bannedURL = require('../../../models/bannedURL');
const discordLogs = require('../../../models/discordLogs');
// require('dotenv').config();

module.exports.bannedURLDetection = async (message, client) => {
  // If gamemaster, ignore
  if (await message.member.roles.cache.find((r) => r.name === 'Game Masters')) return;

  // Get an array of our banned urls from db
  const bannedURLs = await bannedURL.find({}, 'url');

  // if message do not contains an banned url, do not remove it
  if (!bannedURLs.some((w) => message.content.toLowerCase().includes(w.url))) return;

  message
    .reply('That URL has been banned on this server. This has been reported.')
    .then((msg) => setTimeout(() => msg.delete(), 2500));

  setTimeout(() => message.delete(), 2500);

  try {
    // Find the WT Discord
    const guild = await client.guilds.cache.get('322328346799243264');

    // Find the muted roles
    const mutedRole = await guild.roles.cache.get('436865404233711616');
    const reactionRole = await guild.roles.cache.get('733015356062302327');

    // Find the user
    const discordUser = await guild.members.fetch(message.author.id);

    // Log in DB
    await discordLogs.create({
      discordID: message.author.id,
      discordUsername: message?.author?.username,
      logEvent: 'Muted',
      logReason: 'Banned URL',
      message: message?.content,
    });

    // Now give the user the roles
    discordUser.roles.add(mutedRole.id);
    discordUser.roles.add(reactionRole.id);

    // Find report channel
    const reportChannel = await client.channels.cache.get('405047108282875934');

    // Create our message
    const embed = new MessageEmbed()
      .setTitle('User muted: Banned Link')
      .setDescription('The following user has been muted for posted a banned link. More details below.')
      .addField('Username', `${discordUser} || ${discordUser?.nickname ? discordUser?.nickname : message?.author?.username}`)
      .addField('Message', message.content)
      .setFooter(`© BigBOT ${new Date().getFullYear()}`, client.user.avatarURL)
      .setTimestamp();

    // Send embed to channel
    reportChannel.send({ embeds: [embed] });
  } catch (err) { console.error(err); }
};
