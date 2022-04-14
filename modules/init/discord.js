const DiscordJS = require('discord.js');
// require('dotenv').config();

const { onDiscordReady } = require('../discord/events/onReady');
const { onDiscordMessage } = require('../discord/events/onMessage');
const {
  onDiscordInteraction,
} = require('../discord/events/onInteractionCreate');

// Discord Client
const discordClient = new DiscordJS.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  ws: { intents: DiscordJS.Intents.PRIVILEDGED },
  intents: [
    DiscordJS.Intents.FLAGS.GUILDS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    DiscordJS.Intents.FLAGS.GUILD_INTEGRATIONS,
    DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
    DiscordJS.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    DiscordJS.Intents.FLAGS.GUILD_PRESENCES,
  ],
});

// Discord Events
discordClient.on('ready', () => onDiscordReady(discordClient));
discordClient.on('messageCreate', (message) =>
  onDiscordMessage(discordClient, message),
);
discordClient.on('interactionCreate', (interaction) =>
  onDiscordInteraction(discordClient, interaction),
);

// For querying stats
module.exports.queryStats = async () => {
  const GUILD = discordClient.guilds.cache.get('322328346799243264');
  const GUILD_MEMBERS = await GUILD.members.fetch({ withPresences: true });

  const userStats = {
    online: GUILD_MEMBERS.filter(
      (m) =>
        !m?.user?.bot &&
        (m?.presence?.status === 'online' ||
          m?.presence?.status === 'idle' ||
          m?.presence?.status === 'dnd'),
    ).size,
    total: GUILD_MEMBERS.filter((m) => !m?.user?.bot).size,
  };

  return userStats;
};

module.exports.discordClient = discordClient;

// Login in our Discord bot
discordClient.login(process.env.DISCORD_TOKEN);
