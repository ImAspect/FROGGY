const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas')
const { GlobalFonts, Image } = require('@napi-rs/canvas')
const { join } = require('path')
const { request } = require('undici')
const { LEFT_CHANNEL_ID, EMBED_COLOR_TRANSPARENT } = require('../config/discord.json')

module.exports = {
  name: "guildMemberRemove",
  emiter: "on",
  run: async (client, member) => {
    if (!member) return

    // ACTIVE
    delete require.cache[require.resolve('../config/active.json')]
    const active = require('../config/active.json')
    let functions

    active.map((x, index) => {
      if (x.active === true && x.name === 'sendByeOnLeft') {
        functions = true
      } else {
        functions = false
      }
    })
    //ACTIVE
    if (functions === true) {
      const removeMemberEmbed = new EmbedBuilder()
        .setColor(EMBED_COLOR_TRANSPARENT)
        .setDescription(`🔴 ${member.user.tag}`)

      GlobalFonts.registerFromPath(join(__dirname, './Assets', 'font', 'Metamorphous-Regular.otf'), 'Metamorphous')

      const canvas = Canvas.createCanvas(700, 399)
      const context = canvas.getContext('2d')

      const x = canvas.width / 2
      const y = canvas.height / 2

      const min = 1
      const max = 10
      const randomNumber = Math.floor(Math.random() * (max - min)) + min
      const background = await Canvas.loadImage(`./Assets/img/${randomNumber}.jpg`)
      context.drawImage(background, 0, 0, canvas.width, canvas.height)

      context.strokeStyle = '#ffffff'
      context.lineWidth = 5
      context.strokeRect(0, 0, canvas.width, canvas.height)

      context.textAlign = 'center'
      context.fillStyle = '#ffffff'

      context.font = '50px Metamorphous'
      context.fillText(member.user.tag, x, y * 1.4)

      context.font = '25px Metamorphous'
      const allUsers = client.users.cache.filter(user => !user.bot).size
      context.fillText(`Nous sommes plus que ${JSON.stringify(JSON.parse(allUsers) - 1)} joueurs !`, x, y * 1.7)

      const radius = 75
      context.beginPath()
      context.arc(x, y - 70, radius, 0, Math.PI * 2, true)
      context.stroke()
      context.closePath()
      context.clip()

      const { body } = await request(member.user.displayAvatarURL({ format: 'jpg' }))
      const avatar = new Image()
      avatar.src = Buffer.from(await body.arrayBuffer())
      context.drawImage(avatar, x - radius, y - radius - 70, 2 * radius, 2 * radius)

      const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'UserRemove.png' })

      await client.channels.cache.get(LEFT_CHANNEL_ID).send({ embeds: [removeMemberEmbed], files: [attachment] })
    }
  }
}