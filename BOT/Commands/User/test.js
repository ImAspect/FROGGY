const { ApplicationCommandType } = require('discord.js')
const { COMMANDS_CHANNEL_ID } = require('../../config/discord.json')

module.exports = {
	name: "test",
	description: "TEST COMMAND",
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
		if (interaction.channel.id != COMMANDS_CHANNEL_ID && !interaction.member.permissions.has("0x0000000000000008")) {
			return interaction.reply({ content: 'Vous n\'avez pas la permission d\'effectuer cette commande !', ephemeral: true })
		}
		await interaction.reply({ content: 'test', ephemeral: true })
	}
}