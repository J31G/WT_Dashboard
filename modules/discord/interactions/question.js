const { MessageEmbed } = require('discord.js');
const { translate } = require('../../translate/translate');
const faqDB = require('../../../models/faqs');

module.exports.questions = async (discordClient, interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const year = new Date();
  const language = interaction.customId.substring(9).toUpperCase();
  const embedFAQ = interaction?.message?.embeds[0]?.fields
    .map(({ name }) => name.substr(5, name.length - 7));

  const questionData = await faqDB.find({ question: { $in: embedFAQ } });

  const translatedData = questionData.map(async ({ question, answer }) => {
    const translated = {
      question: language !== 'EN' ? await translate(question, language) : question,
      answer: language !== 'EN' ? await translate(answer, language) : answer,
    };
    return translated;
  });

  const description = await translate('Your question is similar to the previously answered question below. If this is irrelevant, feel free to disregard this message.', language);

  const embed = new MessageEmbed()
    .setColor('#00000')
    .setDescription(await description?.text)
    .setFooter({
      text: `© BigBOT ${year.getFullYear()}`,
      iconURL: discordClient.user.avatarURL,
    })
    .setTimestamp();

  await Promise.all(translatedData.map(async (q) => {
    const { question, answer } = await q;
    embed.addField(`**Q: ${question?.text}**`, `**A:** ${answer?.text}`);
  })).then(() => interaction?.editReply({ embeds: [embed], ephemeral: true }));
};
