const Discord = require("discord.js")
const { TOKEN_BOT } = require("./config/discord.json")
const { readdirSync } = require("node:fs")

const client = new Discord.Client({
  intents: new Discord.IntentsBitField(3276799)
})

client.slashCommands = new Discord.Collection()

// Slash Commands Handler
for (const subFolder of readdirSync(`${__dirname}/commands/`)) {
  for (const fileName of readdirSync(`${__dirname}/commands/${subFolder}/`)) {
    let file = require(`${__dirname}/commands/${subFolder}/${fileName}`)

    client.slashCommands.set(file.name, file)
    console.log('⌨️  Command [ ' + fileName + ' ] ✅')
  }
}

// Events Handler
for (const fileName of readdirSync(`${__dirname}/events/`)) {
  let file = require(`${__dirname}/events/${fileName}`)
  let eventEmiter = file.emiter

  client[eventEmiter](file.name, file.run.bind(null, client))
  console.log('🎆️ Event [ ' + fileName + ' ] ✅')
}

client.login(TOKEN_BOT)