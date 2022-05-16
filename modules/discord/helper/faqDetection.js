const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const faqDB = require('../../../models/faqs');

module.exports.faqMessage = async (message, discordClient) => {
  if (message?.channel?.id !== '909956556769087508') return; // bot-test-channel
  // if (message?.channel?.id !== '909773579149770772') return; // technical_issues

  const year = new Date();
  const FAQs = await faqDB.find();
  const relevantQuestions = [];
  FAQs.map((q) => q?.keyword.map((k) => {
    if (message?.content.toLowerCase().includes(k.toLowerCase())) return relevantQuestions.push(q);
    return false;
  }));

  if (!relevantQuestions.length) return;

  const embed = new MessageEmbed()
    .setColor('#00000')
    .setDescription('Your question is similar to the previously answered question below. If this is irrelevant, feel free to disregard this message.')
    .setFooter({
      text: `© BigBOT ${year.getFullYear()}`,
      iconURL: discordClient.user.avatarURL,
    })
    .setTimestamp();

  relevantQuestions.map((q) => embed.addField(`**Q: ${q.question}**`, `**A:** ${q.answer}`));

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('question-en')
        .setStyle('SECONDARY')
        .setEmoji('🏴󠁧󠁢󠁥󠁮󠁧󠁿')
        .setDisabled(true),
      new MessageButton()
        .setCustomId('question-de')
        .setStyle('SECONDARY')
        .setEmoji('🇩🇪'),
      new MessageButton()
        .setCustomId('question-fr')
        .setStyle('SECONDARY')
        .setEmoji('🇫🇷'),
    );

  message.reply({ embeds: [embed], components: [row] });
};
