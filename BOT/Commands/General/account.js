const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const { createAccount, loginAccount, getAccountVerifiedByDiscordId, getAllCharactersByDiscordId } = require('../../api/account')
const { getClassByGender, getRaceByGender } = require('../../custom_modules/getByGender')
const { COMMANDS_CHANNEL_ID, SERVER_NAME } = require('../../config.json')

module.exports = {
    name: "account",
    description: "Ensemble de commandes pour le groupe \"Account\" !",
    type: 2,
    options: [
        {
            name: 'create',
            description: 'Créer votre compte Archimède depuis Discord !',
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
            description: 'Connectez votre compte Archimède à votre compte Discord !',
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
        if (interaction.commandName === 'account' && interaction.options._subcommand === 'create') {
            if (interaction.channel.id != COMMANDS_CHANNEL_ID && !interaction.member.permissions.has("0x0000000000000008")) {
                return interaction.reply({ content: 'Vous n\'avez pas la permission d\'effectuer cette commande !', ephemeral: true })
            }

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
                .then((res) => {
                    if (res.status === 400) {
                        interaction.reply({ content: "Le nom d'utilisateur que vous avez choisi est déjà utilisé ! [❌]", ephemeral: true })
                    } else if (res.status === 401) {
                        interaction.reply({ content: "Le nom d'utilisateur doit être compris entre 8 et 16 caractères et ne peut pas contenir de caractères spéciaux ! [❌]", ephemeral: true })
                    } else if (res.status === 402) {
                        interaction.reply({ content: "L'adresse email que vous avez choisie est déjà utilisée ! [❌]", ephemeral: true })
                    } else if (res.status === 403) {
                        interaction.reply({ content: "Le format de l'adresse email n'est pas valide ! [❌]", ephemeral: true })
                    } else if (res.status === 404) {
                        interaction.reply({ content: "Le mot de passe doit être compris entre 8 et 16 caractères ! [❌]", ephemeral: true })
                    } else if (res.status === 200) {
                        interaction.reply({ content: "Bravo **" + username.toUpperCase() + `** !\nLa création de votre compte **${SERVER_NAME}** est terminé avec succès [✅]`, ephemeral: true })
                    }
                })
        } else if (interaction.commandName === 'account' && interaction.options._subcommand === 'login') {
            if (interaction.channel.id != COMMANDS_CHANNEL_ID && !interaction.member.permissions.has("0x0000000000000008")) {
                return interaction.reply({ content: 'Vous n\'avez pas la permission d\'effectuer cette commande !', ephemeral: true })
            }

            let verified = []

            const test = await getAccountVerifiedByDiscordId(interaction.member.id)
                .then((res) => {
                    if (res.status === 200) {
                        verified.push(res.result)
                    }
                })

            if (verified[0] === undefined) {
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
                            await interaction.reply({ content: "Le compte n'existe pas ! [❌]", ephemeral: true })
                        } else if (res.status === 401) {
                            await interaction.reply({ content: "Le mot de passe est incorrect ! [❌]", ephemeral: true })
                        } else if (res.status === 200) {
                            await interaction.reply({ content: "Bravo **" + username.toUpperCase() + `** !\nVous êtes connecté à votre compte **${SERVER_NAME}** [✅]`, ephemeral: true })
                        }
                    })
            } else {
                await interaction.reply({ content: `Votre compte **${SERVER_NAME}** est déjà connecté ! [✅]`, ephemeral: true })
            }
        } else if (interaction.commandName === 'account' && interaction.options._subcommand === 'characters') {

            let verified = []

            const test = await getAccountVerifiedByDiscordId(interaction.member.id)
                .then((res) => {
                    if (res.status === 200) {
                        verified.push(res.result)
                    }
                })

            if (verified[0] != undefined) {
                getAllCharactersByDiscordId(interaction.member.id)
                    .then(async (res) => {
                        if (res.status === 200) {
                            const charactersEmbed = new EmbedBuilder()
                                .setColor("#666666")
                                .setDescription('**Liste des personnages de votre compte !**')
                                .setTimestamp()
                            res.result.map((x, index) => {
                                charactersEmbed.addFields({ name: `${x.online === 1 ? '🟢' : '🔴'} ${x.name}`, value: `\`${getRaceByGender(x.gender, x.race)}\` - \`${getClassByGender(x.gender, x.class)}\``, inline: false })
                            })

                            const selectMenuCharacters = new ActionRowBuilder()
                                .addComponents(
                                    new SelectMenuBuilder()
                                        .setCustomId('select_characters')
                                        .setPlaceholder('Plus d\'informations sur l\'un de vos personnages ?')
                                        .addOptions(
                                            res.result.map((x, index) => {
                                                return {
                                                    label: x.name,
                                                    description: `${getRaceByGender(x.gender, x.race)} - ${getClassByGender(x.gender, x.class)}`,
                                                    value: `${x.guid}`,
                                                }
                                            })
                                        ),
                                );

                            await interaction.reply({ embeds: [charactersEmbed], components: [selectMenuCharacters], ephemeral: true })

                        }
                    })
            } else {
                await interaction.reply({ content: `Vous n'êtes pas connecté à un compte **${SERVER_NAME}** [❌]\nVeuillez utiliser la commande \`/account login <username> <password>\` pour vous connecter !`, ephemeral: true })
            }
        }
    }
}