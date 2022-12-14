import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder } from 'discord.js'
import moment from 'moment'
moment.locale('fr')
import fs from "fs"
import { getAccountIdByCharacterGuid } from '../Api/account'
import { getCharacterByGuid, getCharactersByAccountId } from '../Api/characters'
import { getTicketById } from '../Api/tickets'
import { getClassByGender, getRaceByGender } from '../custom_modules/getByGender'
import { convertSecondsToTime } from '../custom_modules/convertSecondsToTime'
import { convertMoney } from '../custom_modules/convertMoney'
import { soapCommand } from '../custom_modules/soapCommand'
import { EMBED_COLOR_TRANSPARENT } from '../config/discord.json'

module.exports = {
  name: "interactionCreate",
  emiter: "on",
  run: async (client, interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isSelectMenu() && !interaction.isButton() && !interaction.isModalSubmit()) return

    // COMMANDS
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName)
      command.run(client, interaction)
    }
    // PERMISSIONS//
    const { isLogin } = require('../custom_modules/isLogin')

    let memberLogin

    await isLogin(interaction.member.id)
      .then(async (res) => {
        if (res === false) {
          memberLogin = false
        } else {
          memberLogin = res
        }
      })
    // PERMISSIONS //


    // SELECT MENUS
    if (interaction.isSelectMenu()) {

      // SELECT MENU ASSIGN CHARS
      if (interaction.customId === 'select_assign_chars') {
        const interactionCustomId = interaction.values[0]
        const ticketSplit = interactionCustomId.split("_")
        const ticketId = ticketSplit[1]
        const gmAssign = ticketSplit[0]

        soapCommand(`ticket assign ${ticketId} ${gmAssign}`)

        const ticketAssignEmbed = new EmbedBuilder()
          .setColor(EMBED_COLOR_TRANSPARENT)
          .setDescription(`**Le ticket n??**\`${ticketId}\` **est maintenant assign?? au Ma??tre du jeu** \`${gmAssign}\``)
          .setTimestamp()

        await interaction.update({ embeds: [ticketAssignEmbed], ephemeral: true })
      }

      // SELECT MENU CHARACTERS
      if (interaction.customId === 'select_characters') {
        getCharacterByGuid(interaction.values[0])
          .then(async (res) => {
            if (res.status === 200) {
              const date = new Date(res.result[0].logout_time * 1000)
              const characterEmbed = new EmbedBuilder()
                .setColor(EMBED_COLOR_TRANSPARENT)
                .addFields(
                  { name: 'Nom', value: `??? \`${res.result[0].name}\``, inline: false },
                  { name: 'Points de vie', value: `??? \`${res.result[0].health}\``, inline: false },
                  { name: 'Race', value: `??? \`${getRaceByGender(res.result[0].gender, res.result[0].race)}\``, inline: false },
                  { name: 'Classe', value: `??? \`${getClassByGender(res.result[0].gender, res.result[0].class)}\``, inline: false },
                  { name: 'Niveau', value: `??? \`${res.result[0].level}\``, inline: false },
                  { name: 'Argent', value: `??? \`${convertMoney(res.result[0].money)}\``, inline: false },
                  { name: 'Temps de jeu', value: `??? \`${convertSecondsToTime(res.result[0].totaltime)}\``, inline: false },
                  { name: 'Derni??re d??connexion', value: `??? \`${moment(date).format('LLLL')}\``, inline: false },
                  { name: 'Cr??ation', value: `??? \`${moment(res.result[0].creation_date).format('LLLL')}\``, inline: false }
                )
                .setTimestamp()
              await interaction.update({ embeds: [characterEmbed], ephemeral: true })
            }
          })
      }

      // SELECT MENU TICKETS
      if (interaction.customId === 'select_tickets') {
        getTicketById(interaction.values[0])
          .then(async (res) => {
            if (res.status === 200) {
              const unix_timestamp = res.result[0].createTime
              const date = new Date(unix_timestamp * 1000)
              const ticketEmbed = new EmbedBuilder()
                .setColor(EMBED_COLOR_TRANSPARENT)
                .addFields(
                  { name: 'Ticket N??', value: `??? \`${res.result[0].id}\``, inline: false },
                  { name: 'Ouvert par', value: `??? \`${res.result[0].name}\``, inline: false },
                  { name: 'Description', value: `??? \`${res.result[0].description}\``, inline: false },
                  { name: 'Statut', value: `??? \`${res.result[0].assignedTo === 0 ? '`Pas assign??`' : '`Assign??`'}\``, inline: false },
                  { name: 'Cr??er le', value: `??? \`${moment(date).format('LLLL')}\``, inline: false },
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
              let account

              await getAccountIdByCharacterGuid(res.result[0].assignedTo)
                .then((res) => {
                  if (res.status === 200) {
                    account = res.result
                  }
                })
              {
                account[0] !== undefined ?
                  account[0].id === memberLogin[0].accountId &&
                  ticketButtons.addComponents(
                    new ButtonBuilder()
                      .setCustomId(`ticket_respond_${res.result[0].id}`)
                      .setLabel('R??pondre au ticket')
                      .setStyle(ButtonStyle.Primary)
                      .setDisabled(false),
                  )
                  :
                  ticketButtons.addComponents(
                    new ButtonBuilder()
                      .setCustomId('ticket_respond')
                      .setLabel('R??pondre au ticket')
                      .setStyle(ButtonStyle.Primary)
                      .setDisabled(true),
                  )
              }
              await interaction.update({ embeds: [ticketEmbed], components: [ticketButtons], ephemeral: true })
            }
          })
      }

      // SELECT MENU FUNCTION ENABLE
      if (interaction.customId === 'function_enable') {
        const active = require('../config/active.json')
        const interactionValues = interaction.values[0]
        const functionSplit = interactionValues.split("_")
        const functionId = JSON.parse(functionSplit[2])
        const dataTab = []

        await active.map((x) => {
          if (functionId == x.id) {
            const obj = {
              "id": x.id,
              "name": x.name,
              "description": x.description,
              "active": true
            }
            dataTab.push(obj)
          }
          if (functionId != x.id) {
            const obj = {
              "id": x.id,
              "name": x.name,
              "description": x.description,
              "active": x.active
            }
            dataTab.push(obj)
          }
        })

        fs.writeFile('./config/active.json', JSON.stringify(dataTab), async (err) => {
          if (err) throw err

          const successConfig = new EmbedBuilder()
            .setColor(EMBED_COLOR_TRANSPARENT)
            .setDescription(`La fonctionnalit?? ?? bien ??t?? activ??e ! ???`)
            .setTimestamp()

          await interaction.update({ embeds: [successConfig], components: [], ephemeral: true })
        })
      }
    }

    // SELECT MENU FUNCTION DISABLE
    if (interaction.customId === 'function_disable') {
      const active = require('../config/active.json')
      const interactionValues = interaction.values[0]
      const functionSplit = interactionValues.split("_")
      const functionId = JSON.parse(functionSplit[2])
      const dataTab = []

      await active.map((x) => {
        if (functionId == x.id) {
          const obj = {
            "id": x.id,
            "name": x.name,
            "description": x.description,
            "active": false
          }
          dataTab.push(obj)
        }
        if (functionId != x.id) {
          const obj = {
            "id": x.id,
            "name": x.name,
            "description": x.description,
            "active": x.active
          }
          dataTab.push(obj)
        }
      })

      fs.writeFile('./config/active.json', JSON.stringify(dataTab), async (err) => {
        if (err) throw err

        const successConfig = new EmbedBuilder()
          .setColor(EMBED_COLOR_TRANSPARENT)
          .setDescription(`La fonctionnalit?? ?? bien ??t?? d??sactiv??e ! ???`)
          .setTimestamp()

        await interaction.update({ embeds: [successConfig], components: [], ephemeral: true })
      })
    }

    // BUTTONS
    if (interaction.isButton()) {
      const interactionCustomId = interaction.customId
      const ticketSplit = interactionCustomId.split("_")
      const ticketId = ticketSplit[2]

      // BUTTON ASSIGN TICKET
      if (interaction.customId === `ticket_assign_${ticketId}`) {
        await getCharactersByAccountId(memberLogin[0].accountId)
          .then(async (res) => {
            if (res.status === 200) {
              if (res.result.length > 0) {
                const assignSucces = new ActionRowBuilder()
                  .addComponents(
                    new SelectMenuBuilder()
                      .setCustomId('select_assign_chars')
                      .setPlaceholder('Assigner le ticket ?? l\'un de vos personnages')
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

                await interaction.update({ components: [assignSucces], ephemeral: true })
              } else {
                const noCharacters = new EmbedBuilder()
                .setColor(EMBED_COLOR_TRANSPARENT)
                .setDescription("Vous n'avez pas de personnage sur votre compte ! ???")
                .setTimestamp()
              await interaction.update({ embeds: [noCharacters], components: [], ephemeral: true })
              }
            }
          })

      }

      // BUTTON RESPONSE TICKET
      if (interaction.customId === `ticket_respond_${ticketId}`) {
        const modal = new ModalBuilder()
          .setCustomId(`response_to_${ticketId}`)
          .setTitle('R??PONDRE AU TICKET')

        const respond = new TextInputBuilder()
          .setCustomId(`response_ticket_${ticketId}`)
          .setLabel("Saisissez une r??ponse ?? envoyer au joueur !")
          .setStyle(TextInputStyle.Short)

        const responseToTicket = new ActionRowBuilder().addComponents(respond)

        modal.addComponents(responseToTicket)
        await interaction.showModal(modal)
      }
    }

    // MODAL SUBMIT
    if (interaction.isModalSubmit()) {
      const interactionCustomId = interaction.customId
      const ticketSplit = interactionCustomId.split("_")
      const ticketId = ticketSplit[2]

      // MODAL SUBMIT RESPONSE TICKET
      if (interaction.customId === `response_to_${ticketId}`) {
        const responseToTicket = interaction.fields.getTextInputValue(`response_ticket_${ticketId}`)
        soapCommand(`ticket response append ${ticketId} ${responseToTicket}`)
        soapCommand(`ticket complete ${ticketId}`)
        soapCommand('reload gm_tickets')
        const ticketResponse = new EmbedBuilder()
          .setColor(EMBED_COLOR_TRANSPARENT)
          .setDescription('La r??ponse ?? bien ??t?? envoyer ??????')
          .addFields(
            { name: 'Ticket n??', value: `??? \`${ticketId}\``, inline: false },
            { name: 'R??ponse', value: `??? \`${responseToTicket}\``, inline: false }
          )
          .setTimestamp()
        await interaction.update({ embeds: [ticketResponse], ephemeral: true })
      }
    }
  }
}