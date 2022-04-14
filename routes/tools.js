const express = require('express');
const Discord = require('discord.js');
const userDB = require('../models/users');
const { discordClient } = require('../modules/init/discord');
const { translate } = require('../modules/translate/translate');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};

router.get('/announcements', checkAuth, async (req, res) => {
  const { channels } = await discordClient.guilds.cache.get(
    '322328346799243264',
  );

  const channelData = channels.cache
    .filter((channel) => channel.type === 'GUILD_TEXT')
    .map((channel) => {
      const formatted = {
        id: channel.id,
        name: channel.name,
      };
      return formatted;
    })
    .sort((a, b) => {
      const x = a.name.toLowerCase();
      const y = b.name.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });

  res.render('tools/announcements.ejs', {
    user: req?.user,
    allUsers: await userDB.find(),
    channelData,
  });
});

router.post('/announcements/create', checkAuth, async (req, res) => {
  if (!req.body.announcementTitle || !req.body.announcementMessage)
    return res.status(400).redirect('/tools/announcements');
  if (!req.body.english && !req.body.german && !req.body?.french)
    return res.status(400).redirect('/tools/announcements');
  const year = new Date();
  const embedEN = new Discord.MessageEmbed()
    .setTitle(`:flag_gb: ${req.body.announcementTitle}`)
    .setDescription(req.body.announcementMessage)
    .setFooter(`© BigBOT ${year.getFullYear()}`, discordClient.user.avatarURL)
    .setTimestamp();
  const embedDE = new Discord.MessageEmbed()
    .setTitle(
      `:flag_de: ${(await translate(req.body.announcementTitle, 'DE')).text}`,
    )
    .setDescription((await translate(req.body.announcementMessage, 'DE')).text)
    .setFooter(`© BigBOT ${year.getFullYear()}`, discordClient.user.avatarURL)
    .setTimestamp();
  const embedFR = new Discord.MessageEmbed()
    .setTitle(
      `:flag_fr: ${(await translate(req.body.announcementTitle, 'FR')).text}`,
    )
    .setDescription((await translate(req.body.announcementMessage, 'FR')).text)
    .setFooter(`© BigBOT ${year.getFullYear()}`, discordClient.user.avatarURL)
    .setTimestamp();

  const embeds = [];

  if (req.body?.english) embeds.push(embedEN);
  if (req.body?.german) embeds.push(embedDE);
  if (req.body?.french) embeds.push(embedFR);

  const channel = discordClient.channels.cache.get(
    req.body.announcementChannel,
  );
  channel
    .send({ embeds })
    /* .then((msg) =>
      setTimeout(() => {
        msg.delete().catch(console.error);
      }, 5000),
    ) */
    .catch(console.error);
  return res.status(200).redirect('/tools/announcements');
});

module.exports = router;
