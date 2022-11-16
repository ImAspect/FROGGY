import { ActivityType } from 'discord.js'
import { SERVER_NAME } from '../config/server.json'

module.exports = {
  name: "ready",
  emiter: "on",
  run: async (client) => {
    var slashCommands = client.slashCommands.map(x => x)
    await client.application.commands.set(slashCommands)

    console.log("🤖️ Bot [ " + client.user.tag + " ] ✅ ")
    // ACTIVE
    delete require.cache[require.resolve('../config/active.json')]
    const active = require('../config/active.json')
    let functions

		active.map((x, index) => {
			if (x.name === 'onReadyPresence') {
				if (x.active === true) {
					functions = true
				} else {
					functions = false
				}
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