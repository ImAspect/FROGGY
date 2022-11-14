const { ApplicationCommandType } = require('discord.js')

module.exports = {
	name: "test",
	description: "TEST COMMAND",
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction) => {
		const testEmbed = new EmbedBuilder()
			.setColor(EMBED_COLOR_TRANSPARENT)
			.setDescription(`\`Test\``)
			.setTimestamp()

		await interaction.reply({ embeds: [testEmbed], ephemeral: true })
	}
}