const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const { createAccount, loginAccount } = require('../../api/account')
const { getAllCharactersByDiscordId } = require('../../Api/characters')
const { getClassByGender, getRaceByGender } = require('../../custom_modules/getByGender')
const { EMBED_COLOR_TRANSPARENT } = require('../../config/discord.json')
const { SERVER_NAME } = require('../../config/server.json')

module.exports = {
    name: "account",
    description: `Ensemble de commandes pour les comptes ${SERVER_NAME} !`,
    type: 2,
    options: [
        {
            name: 'create',
            description: `Créer votre compte ${SERVER_NAME} depuis Discord !`,
            type: 1,
            options: [
                {
                    name: 'username',
                    description: 'Votre nom d\'utilisateur !',
                    required: true,
                    type: 3
                },
                {
                    name: 'email',
                    description: 'Votre adresse email !',
                    required: true,
                    type: 3
                },
                {
                    name: 'password',
                    description: 'Votre mot de passe !',
                    required: true,
                    type: 3
                }
            ],
        },
        {
            name: 'login',
            description: `Connectez votre compte ${SERVER_NAME} à votre compte Discord !`,
            type: 1,
            options: [
                {
                    name: 'username',
                    description: 'Votre nom d\'utilisateur !',
                    required: true,
                    type: 3
                },
                {
                    name: 'password',
                    description: 'Votre mot de passe !',
                    required: true,
                    type: 3
                }
            ]
        },
        {
            name: 'characters',
            description: 'Affiche la liste de vos personnages !',
            type: 1
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        // PERMISSIONS//
        const { isLogin } = require('../../custom_modules/isLogin')

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

        // GROUP ACCOUNT
        if (interaction.commandName === 'account') {
            // COMMAND CREATE
            if (interaction.options._subcommand === 'create') {
                if (memberLogin === false) {
                    let username
                    let email
                    let password

                    interaction.options._hoistedOptions.map((x) => {
                        if (x.name === 'username') {
                            username = x.value
                        }
                        if (x.name === 'email') {
                            email = x.value
                        }
                        if (x.name === 'password') {
                            password = x.value
                        }
                    })

                    const data = {
                        username: username,
                        email: email,
                        password: password
                    }

                    createAccount(data)
                        .then(async (res) => {
                            if (res.status === 400) {
                                const status400Embed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription('Le nom d\'utilisateur que vous avez choisi est déjà utilisé ! ❌')
                                    .setTimestamp()

                                await interaction.reply({ embeds: [status400Embed], ephemeral: true })
                            } else if (res.status === 401) {
                                const status401Embed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription('Le nom d\'utilisateur doit être compris entre 8 et 16 caractères et ne peut pas contenir de caractères spéciaux ! ❌')
                                    .setTimestamp()

                                await interaction.reply({ embeds: [status401Embed], ephemeral: true })
                            } else if (res.status === 402) {
                                const status402Embed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription('L\'adresse email que vous avez choisis est déjà utilisée ! ❌')
                                    .setTimestamp()

                                await interaction.reply({ embeds: [status402Embed], ephemeral: true })
                            } else if (res.status === 403) {
                                const status403Embed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription('Le format de l\'adresse email n\'est pas valide ! ❌')
                                    .setTimestamp()

                                await interaction.reply({ embeds: [status403Embed], ephemeral: true })
                            } else if (res.status === 404) {
                                const status404Embed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription('Le mot de passe doit être compris entre 8 et 16 caractères ! ❌')
                                    .setTimestamp()

                                await interaction.reply({ embeds: [status404Embed], ephemeral: true })
                            } else if (res.status === 200) {
                                const status200Embed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription(`Bravo **${username.toUpperCase()}** !\n\nLa création de votre compte **${SERVER_NAME}** est terminé avec succès ✅`)
                                    .setTimestamp()

                                await interaction.reply({ embeds: [status200Embed], ephemeral: true })
                            }
                        })
                } else {
                    const memberisLogin = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Vous êtes déjà connecté à un compte **${SERVER_NAME}** ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [memberisLogin], ephemeral: true })
                }
            }

            // COMMAND LOGIN
            if (interaction.options._subcommand === 'login') {
                if (memberLogin === false) {
                    let username
                    let email
                    let password

                    interaction.options._hoistedOptions.map((x) => {

                        if (x.name === 'username') {
                            username = x.value
                        }
                        if (x.name === 'email') {
                            email = x.value
                        }
                        if (x.name === 'password') {
                            password = x.value
                        }
                    })

                    const data = {
                        username: username,
                        email: email,
                        password: password,
                        discordId: JSON.parse(interaction.member.id)
                    }

                    loginAccount(data)
                        .then(async (res) => {
                            if (res.status === 400) {
                                const noAccountFoundEmbed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription(`Le compte n'existe pas ! ❌`)
                                    .setTimestamp()

                                await interaction.reply({ embeds: [noAccountFoundEmbed], ephemeral: true })
                            } else if (res.status === 401) {
                                const badPasswordEmbed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription(`Le mot de passe est incorrect ! ❌`)
                                    .setTimestamp()
                                await interaction.reply({ embeds: [badPasswordEmbed], ephemeral: true })
                            } else if (res.status === 200) {
                                const accountLoginSuccess = new EmbedBuilder()
                                .setColor(EMBED_COLOR_TRANSPARENT)
                                .setDescription(`Bravo **${username.toUpperCase()}** !\n\nVous êtes connecté à votre compte **${SERVER_NAME}** ✅`)
                                .setTimestamp()
                            await interaction.reply({ embeds: [accountLoginSuccess], ephemeral: true })
                            }
                        })
                } else {
                    const memberisLogin = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Vous êtes déjà connecté à un compte **${SERVER_NAME}** ❌`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [memberisLogin], ephemeral: true })
                }
            }

            // COMMAND CHARACTERS
            if (interaction.options._subcommand === 'characters') {
                if (memberLogin !== false) {
                    getAllCharactersByDiscordId(interaction.member.id)
                        .then(async (res) => {
                            if (res.status === 200) {
                                const charactersEmbed = new EmbedBuilder()
                                    .setColor(EMBED_COLOR_TRANSPARENT)
                                    .setDescription('**Liste des personnages de votre compte !**')
                                    .setTimestamp()
                                res.result.map((x) => {
                                    charactersEmbed.addFields({ name: `${x.online === 1 ? '🟢' : '🔴'} ${x.name}`, value: `\`${getRaceByGender(x.gender, x.race)}\` - \`${getClassByGender(x.gender, x.class)}\``, inline: false })
                                })

                                const selectMenuCharacters = new ActionRowBuilder()
                                    .addComponents(
                                        new SelectMenuBuilder()
                                            .setCustomId('select_characters')
                                            .setPlaceholder('Plus d\'informations sur l\'un de vos personnages ?')
                                            .addOptions(
                                                res.result.map((x) => {
                                                    return {
                                                        label: x.name,
                                                        description: `${getRaceByGender(x.gender, x.race)} - ${getClassByGender(x.gender, x.class)}`,
                                                        value: `${x.guid}`
                                                    }
                                                })
                                            )
                                    )

                                await interaction.reply({ embeds: [charactersEmbed], components: [selectMenuCharacters], ephemeral: true })

                            }
                        })
                } else {
                    const memberisLogin = new EmbedBuilder()
                        .setColor(EMBED_COLOR_TRANSPARENT)
                        .setDescription(`Vous n'êtes pas connecté à un compte **${SERVER_NAME}** ❌\n\nVeuillez utiliser la commande \`/account login <username> <password>\` pour vous connecter !`)
                        .setTimestamp()

                    return await interaction.reply({ embeds: [memberisLogin], ephemeral: true })
                }
            }
        }
    }
}