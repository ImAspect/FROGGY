const { ApplicationCommandType } = require('discord.js')

module.exports = {
	name: "test",
	description: "TEST COMMAND",
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
		await interaction.reply({ content: 'test', ephemeral: true })
	}
}