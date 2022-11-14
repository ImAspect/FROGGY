const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder } = require('discord.js')
const moment = require('moment')
moment.locale('fr')
const { getCharacterByGuid, getTicketById, getAccountVerifiedByDiscordId, getAccountIdByCharacterGuid, getCharactersByAccountId } = require('../Api/account')
const { getClassByGender, getRaceByGender } = require('../custom_modules/getByGender')
const { convertSecondsToTime } = require('../custom_modules/convertSecondsToTime')
const { convertMoney } = require('../custom_modules/convertMoney')
const { soapCommand } = require('../custom_modules/soapCommand')
const { EMBED_COLOR_TRANSPARENT } = require('../config.json')

module.exports = {
  name: "interactionCreate",
  emiter: "on",
  run: async (client, interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isSelectMenu() && !interaction.isModalSubmit() && !interaction.isButton()) return

    if (interaction.isSelectMenu()) {
      if (interaction.customId === 'select_assign_chars') {
        //soapCommand(`ticket assign {$ticketId} ${interaction.values[0]}`)
        const interactionCustomId = interaction.values[0]
        const ticketSplit = interactionCustomId.split("_")
        const ticketId = ticketSplit[1]
        const gmAssign = ticketSplit[0]

        soapCommand(`ticket assign ${ticketId} ${gmAssign}`)

        const ticketAssignEmbed = new EmbedBuilder()
        .setColor(EMBED_COLOR_TRANSPARENT)
        .setDescription(`**Le ticket n°**\`${ticketId}\` **est maintenant assigné au Maître du jeu** \`${gmAssign}\``)
        .setTimestamp()

      await interaction.reply({ embeds: [ticketAssignEmbed], ephemeral: true })
      }
    }

    if (interaction.isButton()) {
      const interactionCustomId = interaction.customId
      const ticketSplit = interactionCustomId.split("_")
      const ticketId = ticketSplit[2]
      if (interaction.customId === `ticket_assign_${ticketId}`) {
        let verified = []

        await getAccountVerifiedByDiscordId(interaction.member.id)
          .then((res) => {
            if (res.status === 200) {
              verified.push(res.result)
            }
          })
        if (verified[0] != undefined) {
          await getCharactersByAccountId(verified[0].accountId)
            .then(async (res) => {
              if (res.status === 200) {
                const assignSucces = new ActionRowBuilder()
                .addComponents(
                  new SelectMenuBuilder()
                    .setCustomId('select_assign_chars')
                    .setPlaceholder('Assigner le ticket à l\'un de vos personnages')
                    .addOptions(
                      res.result.map((x, index) => {
                        return {
                          label: `${x.name}`,
                          description: `  `,
                          value: `${x.name}_${ticketId}`,
                        }
                      })
                    ),
                );

                await interaction.reply({ components: [assignSucces], ephemeral: true })
              }
            })
        }
      } else if (interaction.customId === `ticket_respond_${ticketId}`) {
        const modal = new ModalBuilder()
          .setCustomId(`response_to_${ticketId}`)
          .setTitle('RÉPONDRE AU TICKET')

        const respond = new TextInputBuilder()
          .setCustomId(`response_ticket_${ticketId}`)
          .setLabel("Saisissez une réponse à envoyer au joueur !")
          .setStyle(TextInputStyle.Short)

        const responseToTicket = new ActionRowBuilder().addComponents(respond)

        modal.addComponents(responseToTicket)
        await interaction.showModal(modal)
      }
    }

    if (interaction.isModalSubmit()) {
      const interactionCustomId = interaction.customId
      const ticketSplit = interactionCustomId.split("_")
      const ticketId = ticketSplit[2]
      if (interaction.customId === `response_to_${ticketId}`) {
        const responseToTicket = interaction.fields.getTextInputValue(`response_ticket_${ticketId}`)
        soapCommand(`ticket response append ${ticketId} ${responseToTicket}`)
        soapCommand(`ticket complete ${ticketId}`)
        soapCommand('reload gm_tickets')
        const ticketResponse = new EmbedBuilder()
          .setColor(EMBED_COLOR_TRANSPARENT)
          .setDescription('\`La réponse à bien été envoyer\`')
          .addFields(
            { name: 'Ticket n°', value: `• \`${ticketId}\``, inline: false },
            { name: 'Réponse', value: `• \`${responseToTicket}\``, inline: false }
          )
          .setTimestamp()
        await interaction.reply({ embeds: [ticketResponse], ephemeral: true })
      }
    }

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
              .setColor(EMBED_COLOR_TRANSPARENT)
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

    if (interaction.customId === 'select_tickets') {

      let verified = []

      await getAccountVerifiedByDiscordId(interaction.member.id)
        .then((res) => {
          if (res.status === 200) {
            verified.push(res.result)
          }
        })

      if (verified[0] != undefined) {
        getTicketById(interaction.values[0])
          .then(async (res) => {
            if (res.status === 200) {
              const unix_timestamp = res.result[0].createTime
              const date = new Date(unix_timestamp * 1000)
              const ticketEmbed = new EmbedBuilder()
                .setColor(EMBED_COLOR_TRANSPARENT)
                .addFields(
                  { name: 'Ticket N°', value: `• \`${res.result[0].id}\``, inline: false },
                  { name: 'Ouvert par', value: `• \`${res.result[0].name}\``, inline: false },
                  { name: 'Description', value: `• \`${res.result[0].description}\``, inline: false },
                  { name: 'Statut', value: `• \`${res.result[0].assignedTo === 0 ? '`Pas assigné`' : '`Assigné`'}\``, inline: false },
                  { name: 'Créer le', value: `• \`${moment(date).format('LLLL')}\``, inline: false },
                )
                .setTimestamp()

              const ticketButtons = new ActionRowBuilder()
              {
                res.result[0].assignedTo > 0 ?
                  ticketButtons.addComponents(
                    new ButtonBuilder()
                      .setCustomId('ticket_assign')
                      .setLabel('M\'assigner le ticket')
                      .setStyle(ButtonStyle.Primary)
                      .setDisabled(true),
                  )
                  :
                  ticketButtons.addComponents(
                    new ButtonBuilder()
                      .setCustomId(`ticket_assign_${res.result[0].id}`)
                      .setLabel('M\'assigner le ticket')
                      .setStyle(ButtonStyle.Primary),
                  )
              }
              let account;

              await getAccountIdByCharacterGuid(res.result[0].assignedTo)
                .then((res) => {
                  if (res.status === 200) {
                    account = res.result
                  }
                })
              {
                account[0] !== undefined ?
                  account[0].id === verified[0].accountId &&
                  ticketButtons.addComponents(
                    new ButtonBuilder()
                      .setCustomId(`ticket_respond_${res.result[0].id}`)
                      .setLabel('Répondre au ticket')
                      .setStyle(ButtonStyle.Primary)
                      .setDisabled(false),
                  )
                  :
                  ticketButtons.addComponents(
                    new ButtonBuilder()
                      .setCustomId('ticket_respond')
                      .setLabel('Répondre au ticket')
                      .setStyle(ButtonStyle.Primary)
                      .setDisabled(true),
                  )
              }
              await interaction.reply({ embeds: [ticketEmbed], components: [ticketButtons], ephemeral: true })
            }
          })
      }
    }
  }
}