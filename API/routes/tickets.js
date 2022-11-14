module.exports = (app, db) => {
    app.get('/api/tickets/all', async (req, res, next) => {
        const ticketsModels = require('../models/tickets')(db)
        const result = await ticketsModels.getAllTickets()

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, result: result })
    })

    app.get('/api/ticket/:id', async (req, res, next) => {
        const ticketsModels = require('../models/tickets')(db)
        const result = await ticketsModels.getTicketById(req.params.id)

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, result: result })
    })
}