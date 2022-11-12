const { ApplicationCommandType } = require('discord.js')
const { createAccount } = require('../../api/account')
const { COMMANDS_CHANNEL_ID, ADMIN_COMMANDS_CHANNEL_ID } = require('../../config.json')

module.exports = {
    name: "account",
    description: "Créer un compte Archimède depuis Discord !",
    type: 2,
    require: true,
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
        },
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (interaction.commandName === 'account') {
            if (interaction.channel.id != COMMANDS_CHANNEL_ID && !interaction.member.permissions.has("0x0000000000000008")) return;
            
            let username
            let email
            let password
            interaction.options.data.map((x, index) => {
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
                        interaction.reply({ content: "L'adresse email que vous avez choisie est déjà utilisée ! [❌]", ephemeral: true })
                    } else if (res.status === 402) {
                        interaction.reply({ content: "Le format de l'adresse email n'est pas valide ! [❌]", ephemeral: true })
                    } else if (res.status === 403) {
                        interaction.reply({ content: "Le mot de passe doit comporter au moins 8 caractères ! [❌]", ephemeral: true })
                    } else if (res.status === 200) {
                        interaction.reply({ content: "Bravo **" + username + "** !\nLa création de votre compte est terminé avec succès [✅]", ephemeral: true })
                    }
                })
        }
    }
}