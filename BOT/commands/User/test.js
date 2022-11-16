import { ApplicationCommandType, EmbedBuilder } from 'discord.js'
import { EMBED_COLOR_TRANSPARENT } from '../../config/discord.json'

module.exports = {
	name: "test",
	description: "TEST COMMAND",
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
		// ACTIVE
		delete require.cache[require.resolve('../../config/active.json')]
		const active = require('../../config/active.json')
		let functions

		active.map((x, index) => {
			if (x.name === 'testCommand') {
				if (x.active === true) {
					functions = true
				} else {
					functions = false
				}
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