const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  slash: false,
  testOnly: true,
  description: 'ADMIN: Post holoween message',
  aliases: [],
  category: 'General',
  callback: async ({ message, client }) => {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      message
        .reply('You do not have permission to do that')
        .then((msg) => setTimeout(() => msg.delete(), 3000));
      return '';
    }
    const year = new Date();

    const embed = new MessageEmbed()
      .setColor('#00000')
      .addField(
        '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Easter Event - **Every bunny was kung fu fighting!**',
        '_ _\nPress the **Daily Event** button to get your daily quest!\n\n_This event will end 18.04.2022 - 12:00 Berlin Time._\n_ _',
      )
      .addField(
        '🇩🇪 Osterereignis - **Jeder Hase hat Kung-Fu gekämpft!**',
        '_ _\nDrücke die Schaltfläche **Tägliches Ereignis**, um deine tägliche Aufgabe zu erhalten!\n\n_Diese Veranstaltung endet am 18.04.2022 - 12:00 Uhr Berliner Zeit._\n_ _',
      )
      .addField(
        "🇫🇷 Evénement de Pâques - **Tous les lapins se sont battus en kung-fu!**",
        '_ _\nAppuyez sur le bouton **Événement quotidien** pour obtenir votre défi quotidien!, um deine tägliche Aufgabe zu erhalten!\n\n_Cet événement se terminera le 18.04.2022 - 12:00 heure de Berlin._\n_ _',
      )
      .setImage(
        'https://media.discordapp.net/attachments/900305371787304981/900306192159637594/orange-halloween-banner-with-pumpkin-spider-bats_1017-21309.jpg',
      )
      .setFooter(`© BigBOT ${year.getFullYear()}`, client.user.avatarURL)
      .setTimestamp();

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('easter-event-en')
        .setLabel('Daily Event')
        .setStyle('PRIMARY')
        .setEmoji('🐣'),
      new MessageButton()
        .setCustomId('easter-event-de')
        .setLabel('Tägliches Ereignis')
        .setStyle('SUCCESS')
        .setEmoji('🐣'),
      new MessageButton()
        .setCustomId('easter-event-fr')
        .setLabel('Événement quotidien')
        .setStyle('DANGER')
        .setEmoji('🐣'),
    );

    message.channel.send({ embeds: [embed], components: [row] });
    setTimeout(() => {
      message.delete().catch(console.error);
    }, 500);

    return '';
  },
};
