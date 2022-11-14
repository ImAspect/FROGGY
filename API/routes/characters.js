module.exports = (app, db) => {
    app.get('/api/characters/discord/:discordId', async (req, res, next) => {
        const accountModels = require('../models/account')(db)
        const characterModels = require('../models/characters')(db)
        const getAccountByDiscordId = await accountModels.getAccountVerifiedByDiscordId(req.params.discordId)
        const getCharactersByAccountId = await characterModels.getCharactersByAccountId(getAccountByDiscordId[0].accountId)

        if (getCharactersByAccountId.code) {
            return res.json({ status: 500, err: getCharactersByAccountId.code })
        }

        return res.json({ status: 200, result: getCharactersByAccountId })
    })

    app.get('/api/character/:Guid', async (req, res, next) => {
        const characterModels = require('../models/characters')(db)
        const getCharacterByGuid = await characterModels.getCharacterByGuid(req.params.Guid)

        if (getCharacterByGuid.code) {
            return res.json({ status: 500, err: getCharacterByGuid.code })
        }

        return res.json({ status: 200, result: getCharacterByGuid })
    })

    app.get('/api/characters/all/:accountId', async (req, res, next) => {
        const characterModels = require('../models/characters')(db)

        const result = await characterModels.getCharactersByAccountId(req.params.accountId)

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, result: result })
    })
}