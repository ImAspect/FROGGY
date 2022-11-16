import { ApplicationCommandType, EmbedBuilder } from 'discord.js'
import { EMBED_COLOR_TRANSPARENT } from '../../config/discord.json'
import { SERVER_NAME, SERVER_CORE } from '../../config/server.json'
import { soapCommand } from '../../custom_modules/soapCommand'

module.exports = {
    name: "server",
    description: "[ADMIN] Ensemble de commandes pour le groupe \"Server\" !",
    type: 2,
    options: [
        {
            name: 'restart',
            description: `[ADMIN] Redémarre le serveur ${SERVER_NAME} depuis Discord !`,
            type: 1,
            options: [
                {
                    name: 'seconds',
                    description: `Le nombre de secondes avant le redémarrage du serveur ${SERVER_NAME} (min 5secondes)`,
                    required: true,
                    type: 3
                }
            ]
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        // GROUP SERVER
        if (interaction.commandName === 'server') {
            // PERMISSIONS//
            const { isLogin } = require('../../custom_modules/isLogin')
            const { isGm } = require('../../custom_modules/isGm')

            let memberLogin
            let memberGm
            const serverCore = SERVER_CORE

            await isLogin(interaction.member.id)
                .then(async (res) => {
                    if (res === false) {
                        memberLogin = false
                    } else {
                        memberLogin = res
                    }
                })

            if (memberLogin === false) {
                const memberNoLogin = new EmbedBuilder()
                    .setColor(EMBED_COLOR_TRANSPARENT)
                    .setDescription(`Vous n'êtes pas connecté à un compte **${SERVER_NAME}** ❌\n\nVeuillez utiliser la commande \`/account login <username> <password>\` pour vous connecter !`)
                    .setTimestamp()

                return await interaction.reply({ embeds: [memberNoLogin], ephemeral: true })
            }

            await isGm(memberLogin[0].accountId)
                .then(async (res) => {
                    if (res === false) {
                        memberGm = false
                    } else {
                        memberGm = res
                    }
                })
            if (memberGm === false) {
                const memberNoGm = new EmbedBuilder()
                    .setColor(EMBED_COLOR_TRANSPARENT)
                    .setDescription(`L'équipe **${SERVER_NAME}** sont les seuls à pouvoir accéder aux commandes \`${interaction.commandName}\` ❌`)
                    .setTimestamp()

                return await interaction.reply({ embeds: [memberNoGm], ephemeral: true })
            } else if (serverCore === 'AC') {
                if (memberGm[0].gmlevel != 3) {
                    const memberNoGmAdmin = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Les administrateurs **${SERVER_NAME}** sont les seuls à pouvoir accéder aux commandes \`${interaction.commandName}\` ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [memberNoGmAdmin], ephemeral: true })
                }
            } else if (serverCore === 'TC' || serverCore === 'SC') {
                if (memberGm[0].SecurityLevel != 3) {
                    const memberNoGmAdmin = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Les administrateurs **${SERVER_NAME}** sont les seuls à pouvoir accéder aux commandes \`${interaction.commandName}\` ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [memberNoGmAdmin], ephemeral: true })
                }
            }
            // PERMISSIONS //
            // COMMAND RESTART
            if (interaction.options._subcommand === 'restart') {
                // ACTIVE
                delete require.cache[require.resolve('../../config/active.json')]
                const active = require('../../config/active.json')
                let functions

                active.map((x, index) => {
                    if (x.name === 'serverCommand') {
                        if (x.active === true) {
                            functions = true
                        } else {
                            functions = false
                        }
                    }
                })
                //ACTIVE
                if (functions === true) {
                    let seconds = interaction.options._hoistedOptions[0].value
                    soapCommand(`server restart ${seconds}`)
                    const serverRestartSuccess = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`**Le serveur va redémarrer dans** \`${seconds}\` **secondes !** ✅`)
                        .setTimestamp()

                    await interaction.reply({ embeds: [serverRestartSuccess], ephemeral: true })
                } else {
                    const commandDisable = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Cette fonctionnalité n'est pas active ! ❌`)
                        .setTimestamp()

                    await interaction.reply({ embeds: [commandDisable], ephemeral: true })
                }
            }
        }
    }
};