const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { translate } = require('../../translate/translate');
const faqDB = require('../../../models/faqs');

module.exports.questions = async (discordClient, interaction) => {
  const year = new Date();
  const language = interaction.customId.substring(9).toUpperCase();

  const questionData = await faqDB.findOne({ keyword: 'download' });

  const description = await translate('Your question is similar to the previously answered question below. If this is irrelevant, feel free to disregard this message.', language);
  const question = await translate(questionData.question, language);
  const answer = await translate(questionData.answer, language);

  if (!description || !question || !answer) return;

  const embed = new MessageEmbed()
    .setColor('#00000')
    .setDescription(description?.text)
    .addField(`**Q: ${question?.text}**`, `**A: **${answer?.text}`)
    .setFooter(`© BigBOT ${year.getFullYear()}`, discordClient.user.avatarURL)
    .setTimestamp();

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('question-en')
        .setStyle('PRIMARY')
        .setEmoji('🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
      new MessageButton()
        .setCustomId('question-de')
        .setStyle('PRIMARY')
        .setEmoji('🇩🇪'),
      new MessageButton()
        .setCustomId('question-fr')
        .setStyle('PRIMARY')
        .setEmoji('🇫🇷'),
    );

  // Enable all Buttons
  // eslint-disable-next-line no-return-assign, no-param-reassign
  row.components.map((btn) => btn.disabled = false);

  // Disable button for language
  if (language === 'EN') row.components[0].disabled = true;
  if (language === 'DE') row.components[1].disabled = true;
  if (language === 'FR') row.components[2].disabled = true;

  await interaction?.message.edit({ embeds: [embed], components: [row] });

  return '';
};
