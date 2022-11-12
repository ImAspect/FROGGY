module.exports = {
  name: "ready",
  emiter: "on",
  run: async (client) => {

    var slashCommands = client.slashCommands.map(x => x)
    await client.application.commands.set(slashCommands)

    console.log("🤖️ Bot [ " + client.user.tag + " ] ✅ ")
  }
}