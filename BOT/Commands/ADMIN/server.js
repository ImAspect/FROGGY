const { ApplicationCommandType, EmbedBuilder } = require('discord.js')
const { getAccountVerifiedByDiscordId, getAccountAccessById } = require('../../api/account')
const { EMBED_COLOR_TRANSPARENT } = require('../../config/discord.json')
const { SERVER_NAME } = require('../../config/server.json')
const { soapCommand } = require('../../custom_modules/soapCommand')

module.exports = {
    name: "server",
    description: "[ADMIN] Ensemble de commandes pour le groupe \"Server\" !",
    type: 2,
    options: [
        {
            name: 'restart',
            description: 'Redémarre le serveur depuis Discord !',
            type: 1,
            options: [
                {
                    name: 'seconds',
                    description: 'Le nombre de secondes avant le redémarrage du serveur (min 5secondes)',
                    required: true,
                    type: 3
                }
            ]
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (interaction.commandName === 'server' && interaction.options._subcommand === 'restart') {
            let verified = []

            await getAccountVerifiedByDiscordId(interaction.member.id)
                .then((res) => {
                    if (res.status === 200) {
                        verified.push(res.result)
                    }
                })

            if (verified[0] !== undefined) {
                let accountAccess

                await getAccountAccessById(verified[0].accountId)
                    .then((res) => {
                        if (res.status === 200) {
                            accountAccess = res.result
                        }
                    })
                if (accountAccess[0] !== undefined) {
                    if (accountAccess[0].gmlevel === 3) {
                        let seconds = interaction.options._hoistedOptions[0].value
                        soapCommand(`server restart ${seconds}`)
                        const serverRestartSuccess = new EmbedBuilder()
                            .setColor(EMBED_COLOR_TRANSPARENT)
                            .setDescription(`\`Le serveur va redémarrer dans ${seconds} secondes !\``)
                            .setTimestamp()
    
                        await interaction.reply({ embeds: [serverRestartSuccess], ephemeral: true })
                    } else {
                        await interaction.reply({ content: `Les administrateurs **${SERVER_NAME}** sont les seuls à pouvoir accéder au \`Server\` [❌]\n`, ephemeral: true })
                    }
                } else {
                    await interaction.reply({ content: `Les administrateurs **${SERVER_NAME}** sont les seuls à pouvoir accéder au \`Server\` [❌]\n`, ephemeral: true })
                }
            } else {
                await interaction.reply({ content: `Vous n'êtes pas connecté à un compte **${SERVER_NAME}** [❌]\nVeuillez utiliser la commande \`/account login <username> <password>\` pour vous connecter !`, ephemeral: true })
            }
        }
    }
}