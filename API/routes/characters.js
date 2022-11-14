module.exports = (app, db) => {
    app.get('/api/characters/tickets/all', async (req, res, next) => {
        const characterModels = require('../models/characters')(db)
        const result = await characterModels.getAllTickets()

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, result: result })
    })

    app.get('/api/characters/ticket/:id', async (req, res, next) => {
        const characterModels = require('../models/characters')(db)
        const result = await characterModels.getTicketById(req.params.id)

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, result: result })
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