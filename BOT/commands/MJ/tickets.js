import { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } from 'discord.js'
import { getAllTickets } from '../../api/tickets'
import { EMBED_COLOR_TRANSPARENT } from '../../config/discord.json'
import { SERVER_NAME } from '../../config/server.json'

module.exports = {
	name: "tickets",
	description: `[GM] Ensemble de commandes pour les tickets ${SERVER_NAME} !`,
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
		// GROUP TICKETS
		if (interaction.commandName === 'tickets') {
			// ACTIVE
			delete require.cache[require.resolve('../../config/active.json')]
			const active = require('../../config/active.json')
			let functions

			active.map((x, index) => {
				if (x.name === 'ticketsCommand') {
					if (x.active === true) {
						functions = true
					} else {
						functions = false
					}
				}
			})
			//ACTIVE
			if (functions === true) {
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

					return await interaction.update({ embeds: [memberNoLogin], ephemeral: true })
				}

				await isGm(memberLogin[0].accountId)
					.then(async (res) => {
						if (res === false || res === undefined) {
							memberGm = false
						} else {
							memberGm = res
						}
					})

				if (memberGm === false || memberGm === undefined) {
					const memberNoGm = new EmbedBuilder()
						.setColor(EMBED_COLOR_TRANSPARENT)
						.setDescription(`L'équipe **${SERVER_NAME}** sont les seuls à pouvoir accéder aux commandes \`${interaction.commandName}\` ❌`)
						.setTimestamp()

					return await interaction.update({ embeds: [memberNoGm], ephemeral: true })
				}
				// PERMISSIONS //
				await getAllTickets()
					.then(async (res) => {
						if (res.status === 200) {
							if (res.result[0] !== undefined) {
								const ticketsEmbed = new EmbedBuilder()
									.setColor(EMBED_COLOR_TRANSPARENT)
									.setDescription('**Liste des tickets actuellement ouverts !**')
									.setTimestamp()
								res.result.map(async (x) => {
									ticketsEmbed.addFields({ name: `Ticket n° ${x.id}`, value: `**Joueur** \`${x.name}\` \n**Description** \`${x.description}\` \n${x.assignedTo === 0 ? '**Statut** `Pas assigné`' : '**Statut** `Assigné`'}`, inline: false })
								})

								const selectTickets = new ActionRowBuilder()
									.addComponents(
										new SelectMenuBuilder()
											.setCustomId('select_tickets')
											.setPlaceholder('Effectuer une action sur un ticket !')
											.addOptions(
												res.result.map((x, index) => {
													return {
														label: `Ticket ouvert par ${x.name}`,
														description: `Ticket n°${x.id}`,
														value: `${x.id}`,
													}
												})
											),
									);


								await interaction.reply({ embeds: [ticketsEmbed], components: [selectTickets], ephemeral: true })
							} else {
								const noTicketsEmbed = new EmbedBuilder()
									.setColor(EMBED_COLOR_TRANSPARENT)
									.setDescription('**Aucun ticket disponible pour le moment, réessayer dans quelques instants ! ❌**')
									.setTimestamp()

								await interaction.reply({ embeds: [noTicketsEmbed], ephemeral: true })
							}
						}
					})
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