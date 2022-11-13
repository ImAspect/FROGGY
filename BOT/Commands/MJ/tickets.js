const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const { getAccountVerifiedByDiscordId, getAccountAccessById, getAllTickets } = require('../../api/account')
const { SERVER_NAME, ROLE_MJ_ID, ROLE_ADMIN_ID, EMBED_COLOR_TRANSPARENT } = require('../../config.json')

module.exports = {
	name: "tickets",
	description: "[GM] Ensemble de commandes pour le groupe \"Tickets\" !",
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
		if (interaction.commandName === 'tickets') {
			let verified = []

			await getAccountVerifiedByDiscordId(interaction.member.id)
				.then((res) => {
					if (res.status === 200) {
						verified.push(res.result)
					}
				})

			if (verified[0] != undefined) {
				let accountAccess

				await getAccountAccessById(verified[0].accountId)
					.then((res) => {
						if (res.status === 200) {
							accountAccess = res.result
						}
					})
				if (accountAccess[0] !== undefined) {
					await getAllTickets()
						.then(async (res) => {
							if (res.status === 200) {
								if (res.result !== undefined) {
									const ticketsEmbed = new EmbedBuilder()
										.setColor(EMBED_COLOR_TRANSPARENT)
										.setDescription('**Liste des tickets actuellement ouverts !**')
										.setTimestamp()
									res.result.map(async (x) => {
										ticketsEmbed.addFields({ name: `Ticket n° ${x.id}`, value: `**Joueur** \`${x.name}\`\n**Description** \`${x.description}\`\n${x.assignedTo === 0 ? '**Statut** `Pas assigné`' : '**Statut** `Assigné`'}`, inline: false })
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


									await interaction.reply({ embeds: [ticketsEmbed], components: [selectTickets] , ephemeral: true })
								} else {
									const noTicketsEmbed = new EmbedBuilder()
										.setColor(EMBED_COLOR_TRANSPARENT)
										.setDescription('**Aucun ticket disponible pour le moment, réessayer dans quelques instants ! [❌]**')
										.setTimestamp()

									await interaction.reply({ embeds: [noTicketsEmbed], ephemeral: true })
								}
							}
						})
				} else {
					await interaction.reply({ content: `L'équipe **${SERVER_NAME}** sont les seuls à pouvoir accéder aux \`tickets\` [❌]\n`, ephemeral: true })
				}

			} else {
				await interaction.reply({ content: `Vous n'êtes pas connecté à un compte **${SERVER_NAME}** [❌]\nVeuillez utiliser la commande \`/account login <username> <password>\` pour vous connecter !`, ephemeral: true })
			}
		}
	}
}