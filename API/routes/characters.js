module.exports = (app, db) => {
    app.get('/api/characters/tickets/all', async (req, res, next) => {
        const characterModels = require('../models/characters')(db)
        const result = await characterModels.getAllTickets()

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, result: result })
    })
}