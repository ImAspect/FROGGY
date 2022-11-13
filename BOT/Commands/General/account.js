const { ApplicationCommandType, EmbedBuilder } = require('discord.js')
const { createAccount, loginAccount, getAccountVerifiedByDiscordId, getAllCharactersByDiscordId } = require('../../api/account')
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
                            console.log(res.result)

                            function getClassFromGender(genderId, classId) {
                                switch (genderId) {
                                    case 0:
                                        switch (classId) {
                                            case 1:
                                                return 'Guerrier'
                                            case 2:
                                                return 'Paladin'
                                            case 3:
                                                return 'Chasseur'
                                            case 4:
                                                return 'Voleur'
                                            case 5:
                                                return 'Prêtre'
                                            case 6:
                                                return 'Chevalier de la mort'
                                            case 7:
                                                return 'Chaman'
                                            case 8:
                                                return 'Mage'
                                            case 9:
                                                return 'Démoniste'
                                            case 11:
                                                return 'Druide'
                                            default:
                                                break
                                        }
                                    case 1:
                                        switch (classId) {
                                            case 1:
                                                return 'Guerrière'
                                            case 2:
                                                return 'Paladin'
                                            case 3:
                                                return 'Chasseuse'
                                            case 4:
                                                return 'Voleuse'
                                            case 5:
                                                return 'Prêtresse'
                                            case 6:
                                                return 'Chevalière de la mort'
                                            case 7:
                                                return 'Chaman'
                                            case 8:
                                                return 'Mage'
                                            case 9:
                                                return 'Démoniste'
                                            case 11:
                                                return 'Druidesse'
                                            default:
                                                break
                                        }
                                    default:
                                        break
                                }
                            }

                            function getRaceFromGender(genderId, raceId) {
                                switch (genderId) {
                                    case 0:
                                        switch (raceId) {
                                            case 1:
                                                return 'Humain'
                                            case 2:
                                                return 'Orc'
                                            case 3:
                                                return 'Nain'
                                            case 4:
                                                return 'Elfe de la nuit'
                                            case 5:
                                                return 'Mort-vivant'
                                            case 6:
                                                return 'Tauren'
                                            case 7:
                                                return 'Gnome'
                                            case 8:
                                                return 'Troll'
                                            case 10:
                                                return 'Elfe de sang'
                                            case 11:
                                                return 'Draeneï'
                                            default:
                                                break
                                        }
                                    case 1:
                                        switch (raceId) {
                                            case 1:
                                                return 'Humaine'
                                            case 2:
                                                return 'Orque'
                                            case 3:
                                                return 'Naine'
                                            case 4:
                                                return 'Elfe de la nuit'
                                            case 5:
                                                return 'Morte-vivante'
                                            case 6:
                                                return 'Taurène'
                                            case 7:
                                                return 'Gnome'
                                            case 8:
                                                return 'Trollesse'
                                            case 10:
                                                return 'Elfe de sang'
                                            case 11:
                                                return 'Draeneï'
                                            default:
                                                break
                                        }
                                    default:
                                        break
                                }
                            }

                            const charactersEmbed = new EmbedBuilder()
                                .setColor("#666666")
                                .setDescription('**Liste des personnages de votre compte !**')
                                .setTimestamp()
                            res.result.map((x, index) => {
                                charactersEmbed.addFields({ name: `${x.online === 1 ? '🟢' : '🔴'} ${x.name}`, value: `\`${getRaceFromGender(x.gender, x.race)}\` - \`${getClassFromGender(x.gender, x.class)}\``, inline: false })
                            })

                            interaction.reply({ embeds: [charactersEmbed], ephemeral: true });

                        }
                    })
            } else {
                await interaction.reply({ content: `Vous n'êtes pas connecté à un compte **${SERVER_NAME}** [❌]\nVeuillez utiliser la commande \`/account login <username> <password>\` pour vous connecter !`, ephemeral: true })
            }
        }
    }
}