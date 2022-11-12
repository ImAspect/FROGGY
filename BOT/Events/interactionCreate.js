module.exports = {
  name: "interactionCreate",
  emiter: "on",
  run: async (client, interaction) => {
    if (!interaction.isChatInputCommand() && !interaction.isSelectMenu() && !interaction.isModalSubmit()) return;

    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName)
      command.run(client, interaction)
    }
  }
}