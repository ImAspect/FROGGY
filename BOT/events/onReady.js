module.exports = {
  name: "ready",
  emiter: "on",
  run: async (client) => {
    const { ActivityType } = require('discord.js')
    const { SERVER_NAME } = require('../config/server.json')

    var slashCommands = client.slashCommands.map(x => x)
    await client.application.commands.set(slashCommands)

    console.log("🤖️ Bot [ " + client.user.tag + " ] ✅ ")
    // ACTIVE
    const active = require('../config/active.json')
    let functions

    active.map((x, index) => {
      if (x.active === true && x.name === 'onReadyPresence') {
        functions = true
      } else {
        functions = false
      }
    })
    //ACTIVE
    if (functions === true) {
      client.user.setPresence({
        activities: [{ name: `${SERVER_NAME}`, type: ActivityType.Playing }],
        status: 'online',
      })
    }
  }
}