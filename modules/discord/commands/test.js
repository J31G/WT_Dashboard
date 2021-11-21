const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const faqDB = require('../../../models/faqs');

module.exports = {
  slash: false,
  testOnly: true,
  description: 'ADMIN: Question Test',
  aliases: [],
  category: 'General',
  callback: async ({ message, client }) => {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) { message.reply('You do not have permission to do that').then((msg) => setTimeout(() => msg.delete(), 3000)); return ''; }
    const year = new Date();

    const question = await faqDB.findOne({ keyword: 'download' });

    const embed = new MessageEmbed()
      .setColor('#00000')
      .setDescription('Your question is similar to the previously answered question below. If this is irrelevant, feel free to disregard this message.')
      .addField(`**Q: ${question.question}**`, `**A:** ${question.answer}`)
      .setFooter(`© BigBOT ${year.getFullYear()}`, client.user.avatarURL)
      .setTimestamp();

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('question-en')
          .setStyle('PRIMARY')
          .setEmoji('🏴󠁧󠁢󠁥󠁮󠁧󠁿')
          .setDisabled(true),
        new MessageButton()
          .setCustomId('question-de')
          .setStyle('PRIMARY')
          .setEmoji('🇩🇪'),
        new MessageButton()
          .setCustomId('question-fr')
          .setStyle('PRIMARY')
          .setEmoji('🇫🇷'),
      );

    message.reply({ embeds: [embed], components: [row] });

    return '';
  },
};
