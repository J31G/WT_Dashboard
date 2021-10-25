const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  slash: false,
  testOnly: true,
  description: 'ADMIN: Post holoween message',
  aliases: [],
  category: 'General',
  callback: async ({ message, client }) => {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) { message.reply('You do not have permission to do that').then((msg) => setTimeout(() => msg.delete(), 3000)); return ''; }
    const year = new Date();

    const embed = new MessageEmbed()
      .setColor('#00000')
      .addField('🏴󠁧󠁢󠁥󠁮󠁧󠁿 Hee! Hee! **Spooky Halloween challenges!**', 'Press the **Daily Event** button to get your daily quest!\n_This event will end 01.11.2021 - 12:00 Berlin Time_')
      .addField('🇩🇪 Hee! Hee! **Gruselige Halloween-Herausforderungen!**', 'Drücke die Schaltfläche **Tägliches Ereignis**, um deine tägliche Aufgabe zu erhalten!\n_Diese Veranstaltung endet am 01.11.2021 - 12:00 Uhr Berliner Zeit._')
      .addField("🇫🇷 Hee ! Hee ! **Défis d'Halloween effrayants!**", 'Appuyez sur le bouton **Événement quotidien** pour obtenir votre défi quotidien!, um deine tägliche Aufgabe zu erhalten!\n_Cet événement se terminera le 01.11.2021 - 12:00 heure de Berlin._')
      .setImage('https://media.discordapp.net/attachments/900305371787304981/900306192159637594/orange-halloween-banner-with-pumpkin-spider-bats_1017-21309.jpg')
      .setFooter(`© BigBOT ${year.getFullYear()}`, client.user.avatarURL)
      .setTimestamp();

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('halloween-event-en')
          .setLabel('Daily Event')
          .setStyle('PRIMARY')
          .setEmoji('🎃'),
        new MessageButton()
          .setCustomId('halloween-event-de')
          .setLabel('Tägliches Ereignis')
          .setStyle('SUCCESS')
          .setEmoji('🎃'),
        new MessageButton()
          .setCustomId('halloween-event-fr')
          .setLabel('Événement quotidien')
          .setStyle('DANGER')
          .setEmoji('🎃'),
      );

    message.channel.send({ embeds: [embed], components: [row] });
    setTimeout(() => message.delete(), 500);

    return '';
  },
};
