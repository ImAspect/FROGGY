const { ApplicationCommandType, EmbedBuilder } = require('discord.js')
const { EMBED_COLOR_TRANSPARENT } = require('../../config/discord.json')

module.exports = {
	name: "test",
	description: "TEST COMMAND",
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
		// ACTIVE
		const active = require('../../config/active.json')
		let functions

		active.map((x, index) => {
			if (x.active === true && x.name === 'testCommand') {
				functions = true
			} else {
				functions = false
			}
		})
		//ACTIVE
		if (functions === true) {
			const testEmbed = new EmbedBuilder()
				.setColor(EMBED_COLOR_TRANSPARENT)
				.setDescription(`\`Test\``)
				.setTimestamp()

			await interaction.reply({ embeds: [testEmbed], ephemeral: true })
		} else {
			const commandDisable = new EmbedBuilder()
				.setColor(EMBED_COLOR_TRANSPARENT)
				.setDescription(`Cette fonctionnalité n'est pas active ! ❌`)
				.setTimestamp()

			await interaction.reply({ embeds: [commandDisable], ephemeral: true })
		}
	}
}