// Global Imports
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const DiscordJS = require('discord.js');
require('dotenv').config();

// Local Imports
const rootRoute = require('./routes/root');
const eventsRoute = require('./routes/events');
const submitRoute = require('./routes/submit');
const errorRoute = require('./routes/error');
const usersDB = require('./models/users');
const { initExpress } = require('./modules/init/express');
const { initialise: initialisePassport } = require('./modules/init/passport');
const { onDiscordReady } = require('./modules/discord/events/onReady');
const { onDiscordMessage } = require('./modules/discord/events/onMessage');
const { onDiscordInteraction } = require('./modules/discord/events/onInteractionCreate');

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
  ],
});

// DB connect
mongoose.connect(process.env.MONGO_URI).catch((err) => console.error(err));

// Get out users list from DB and init passport
(async () => {
  const users = await usersDB.find({});

  initialisePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id),
  );
})();

// Express Setup
const app = express();
initExpress(app);

// Express Routes
app.use('/', rootRoute);
app.use('/events', eventsRoute);
app.use('/submit', submitRoute);
app.use('*', errorRoute);

// Discord Events
discordClient.on('ready', () => onDiscordReady(discordClient));
discordClient.on('messageCreate', (message) => onDiscordMessage(discordClient, message));
discordClient.on('interactionCreate', (interaction) => onDiscordInteraction(discordClient, interaction));

// HTTP address/port for our web app
const server = app.listen(process.env.PORT || 5000, process.env.ADDRESS || 'localhost', () => {
  const { address, port } = server.address();
  console.log(`Web server running on http://${address}:${port}`);
});

// Login in our Discord bot
discordClient.login(process.env.DISCORD_TOKEN);
