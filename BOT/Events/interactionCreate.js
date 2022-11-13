const { EmbedBuilder } = require('discord.js')
const moment = require('moment')
moment.locale('fr')
const { getCharacterByGuid } = require('../Api/account')
const { getClassByGender, getRaceByGender } = require('../custom_modules/getByGender')
const { convertSecondsToTime } = require('../custom_modules/convertSecondsToTime')
const { convertMoney } = require('../custom_modules/convertMoney')

module.exports = {
  name: "interactionCreate",
  emiter: "on",
  run: async (client, interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isSelectMenu() && !interaction.isModalSubmit()) return;

    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName)
      command.run(client, interaction)
    }

    if (interaction.customId === 'select_characters') {
      getCharacterByGuid(interaction.values[0])
        .then(async (res) => {
          if (res.status === 200) {
            const date = new Date(res.result[0].logout_time * 1000)
            const characterEmbed = new EmbedBuilder()
              .setColor("#666666")
              .addFields(
                { name: 'Nom', value: `• \`${res.result[0].name}\``, inline: false },
                { name: 'Points de vie', value: `• \`${res.result[0].health}\``, inline: false },
                { name: 'Race', value: `• \`${getRaceByGender(res.result[0].gender, res.result[0].race)}\``, inline: false },
                { name: 'Classe', value: `• \`${getClassByGender(res.result[0].gender, res.result[0].class)}\``, inline: false },
                { name: 'Niveau', value: `• \`${res.result[0].level}\``, inline: false },
                { name: 'Argent', value: `• \`${convertMoney(res.result[0].money)}\``, inline: false },
                { name: 'Temps de jeu', value: `• \`${convertSecondsToTime(res.result[0].totaltime)}\``, inline: false },
                { name: 'Dernière déconnexion', value: `• \`${moment(date).format('LLLL')}\``, inline: false },
                { name: 'Création', value: `• \`${moment(res.result[0].creation_date).format('LLLL')}\``, inline: false }
              )
              .setTimestamp()
            await interaction.reply({ embeds: [characterEmbed], ephemeral: true })
          }
        })
    }
  }
}