const { MessageEmbed } = require('discord.js');

module.exports = {
  slash: 'both',
  testOnly: true,
  description: 'Download links for WolfTeam AeriaGames',
  expectedArgs: '[user]',
  aliases: ['link'],
  category: 'General',
  cooldown: '60s',
  callback: ({
    message, args, client, interaction,
  }) => {
    const year = new Date();
    const user = args[0] || '';
    const userText = String(user).startsWith('<@') && String(user).endsWith('>') ? `${user} check out the below: \n\n` : '';
    const embed = new MessageEmbed()
      .setColor(3447003)
      .setTitle('Wolfteam Download Links (Mirror)')
      .setDescription(`${userText}Below you will find the download links for Wolfteam Aeria, to be used if the offical links are not working or are down. Please use at your own risk.`)

      /* // Offline Installers */
      .addField('_ _', ':link: Offline Installers')
      .addField(':flag_gb: English', 'https://cdn.wolfteam.info/wolfteam/en/Wolfteam_EN_Offline_Installer.exe', true)
      .addField(':flag_de: German', 'https://cdn.wolfteam.info/wolfteam/de/Wolfteam_DE_Offline_Installer.exe', true)
      .addField(':flag_fr: French', 'https://cdn.wolfteam.info/wolfteam/fr/Wolfteam_FR_Offline_Installer.exe', true)

      .setFooter(`© BigBOT ${year.getFullYear()}`, client.user.avatarURL)
      .setTimestamp();

    if (interaction) return interaction.reply({ embeds: [embed] });
    message.reply({ embeds: [embed] });
    setTimeout(() => message.delete(), 500);
    return '';
  },
};
