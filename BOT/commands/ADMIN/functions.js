import { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } from ('discord.js')
import { EMBED_COLOR_TRANSPARENT } from '../../config/discord.json'
import { SERVER_NAME, SERVER_CORE } from '../../config/server.json'

module.exports = {
    name: "functions",
    description: "[ADMIN] Ensemble de commandes pour le groupe \"Server\" !",
    type: 2,
    options: [
        {
            name: 'enable',
            description: `[ADMIN] Active des fonctionnalités du bot !`,
            type: 1
        },
        {
            name: 'disable',
            description: `[ADMIN] Désactive des fonctionnalités du bot !`,
            type: 1
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        // GROUP SERVER
        if (interaction.commandName === 'functions') {
            // PERMISSIONS//
            const { isLogin } = require('../../custom_modules/isLogin')
            const { isGm } = require('../../custom_modules/isGm')

            let memberLogin
            let memberGm

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
            } else if (SERVER_CORE === 'AC') {
                if (memberGm[0].gmlevel != 3) {
                    const memberNoGmAdmin = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Les administrateurs **${SERVER_NAME}** sont les seuls à pouvoir accéder aux commandes \`${interaction.commandName}\` ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [memberNoGmAdmin], ephemeral: true })
                }
            } else if (SERVER_CORE === 'TC' || SERVER_CORE === 'SC') {
                if (memberGm[0].SecurityLevel != 3) {
                    const memberNoGmAdmin = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Les administrateurs **${SERVER_NAME}** sont les seuls à pouvoir accéder aux commandes \`${interaction.commandName}\` ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [memberNoGmAdmin], ephemeral: true })
                }
            }
            // PERMISSIONS //
            // COMMAND ENABLE
            if (interaction.options._subcommand === 'enable') {
                delete require.cache[require.resolve('../../config/active.json')]
                const active = require('../../config/active.json')
                const functions = []

                active.map((x, index) => {
                    if (x.active === false) functions.push(x)
                })

                if (functions.length > 0) {
                    const functionsEnableSelect = new ActionRowBuilder()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId('function_enable')
                                .setPlaceholder('Sélectionnez une fonctionnalité à activée !')
                                .addOptions(
                                    functions.map((x) => {
                                        return {
                                            label: x.name,
                                            description: `${x.description}`,
                                            value: `function_enable_${x.id}`
                                        }
                                    })
                                )
                        )

                    await interaction.reply({ components: [functionsEnableSelect], ephemeral: true })
                } else {
                    const noFunctions = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Toutes les fonctionnalités sont actives ! ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [noFunctions], ephemeral: true })
                }
            }

            // COMMAND DISABLE
            if (interaction.options._subcommand === 'disable') {
                delete require.cache[require.resolve('../../config/active.json')]
                const active = require('../../config/active.json')
                const functions = []

                active.map((x, index) => {
                    if (x.active === true) functions.push(x)
                })

                if (functions.length > 0) {
                    const functionsDisableSelect = new ActionRowBuilder()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId('function_disable')
                                .setPlaceholder('Sélectionnez une fonctionnalité à désactivée !')
                                .addOptions(
                                    functions.map((x, index) => {
                                        return {
                                            label: x.name,
                                            description: `${x.description}`,
                                            value: `function_disable_${x.id}`
                                        }
                                    })
                                )
                        )

                    await interaction.reply({ components: [functionsDisableSelect], ephemeral: true })
                } else {
                    const noFunctions = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Pas de fonctionnalité active ! ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [noFunctions], ephemeral: true })
                }
            }
        }
    }
}